---
title: Unregister a VMM server script
description: This article describes the cleanup script on the VMM server
manager: evansma
ms.service: site-recovery
ms.topic: conceptual
ms.date: 03/25/2021
ms.author: ankitadutta
author: ankitaduttaMSFT
---

# Cleanup script on a VMM server
If your VMM server was in a Disconnected state, then download and run the cleanup script on the VMM server.


```
pushd .
try
{
    $error.Clear()
    "This script will remove the old Hyper-V Recovery Manager related properties for this VMM. This can be run in below scenarios :"
    "1. Complete VMM site clean up."
    "2. VMM site clean up in case the associated VMM has become unresponsive. Input in this case will be the VMM ID of the unresponsive server."

    $choice = Read-Host "Enter your choice "

    if($choice -eq 1)
    {
        $vmmid = get-itemproperty 'hklm:\software\Microsoft\Microsoft System Center Virtual Machine Manager Server\Setup' -Name VMMID
        $vmmid = $vmmid.VmmID

        # $fullCleanup = 1 indicates that clean up all hyper-V recovery manager settings from this VMM.
        $fullCleanup = 1

    }
    else
    {
        try
        {
            [GUID]$vmmid = Read-Host "Enter the VMMId for the unresponsive VMM server  "
        }
        catch
        {
            Write-Host "Error occurred" -ForegroundColor "Red"
            $error[0]
            return
        }

        # $fullCleanup = 0 indicates that clean up only those clouds/VMs which are protecting/protected by the objects on the given VMMId.
        $fullCleanup = 0
    }

    if($vmmid -ne "")
    {

        Write-Host "Proceeding to remove Hyper-V Recovery Manager related properties for this VMM with ID: "  $vmmid
        Write-Host "Before running the script ensure that the VMM service is running."
        Write-Host "In a VMM cluster ensure that the Windows Cluster service is running and run the script on each node."
        Write-Host "The VMM service (or the Cluster role) will be stopped when the script runs. After the script completes, restart the VMM or Cluster service."

        $choice =  Read-Host "Do you want to continue (Y/N) ?"
        ""
        if($choice.ToLower() -eq "y" -or $choice.ToLower() -eq "yes" )
        {
            $isCluster = $false
            $path = 'HKLM:\SOFTWARE\Microsoft\Microsoft System Center Virtual Machine Manager Server\Setup'
            $key = Get-Item -LiteralPath $path -ErrorAction SilentlyContinue
            $name = 'HAVMMName'
            if ($key)
            {
                $clusterName = $key.GetValue($name, $null)
                if($clusterName -eq $null)
                {
                    $serviceName = "SCVMMService"
                    $service = Get-Service -Name $serviceName
                    if ($service.Status -eq "Running")
                    {
                        "Stopping the VMM service..."
                            net stop $serviceName
                    }
                    else
                    {
                        if($service.Status -eq "Stopped")
                        {
                            "VMM service is not running."
                        }
                        else
                        {
                            "Could not stop the VMM service as it is starting or stopping. Please try again later"
                            return
                        }

                    }
                }
                else
                {
                    $isCluster = $True
                    $isPrimaryNode = $false
                    $clusterName = $key.GetValue($name, $null)

                    Write-Host "Clustered VMM detected"

                    $clusService = Get-Service -Name ClusSvc
                    Add-Type -AssemblyName System.ServiceProcess
                    if ($clusService.Status -ne [System.ServiceProcess.ServiceControllerStatus]::Running)
                    {
                        Write-Host "Windows Cluster service is not running on this machine. Please start Windows cluster service before running this script"
                        return
                    }

                    $clusterResources = Get-ClusterResource -Cluster $clusterName
                    Write-Host "Searching for VMM cluster resource....."

                    foreach ($clusterResource in $clusterResources)
                    {
                        if ($clusterResource.Name -match 'VMM Service')
                        {
                            Write-Host "Found SCVMM Cluster Resource" $clusterResource
                            Write-Host "Cluster owner node is " $clusterResource.OwnerNode
                            $currentHostName = [System.Net.Dns]::GetHostName()
                            $clusterCheckpointList =  get-clustercheckpoint -ResourceName $clusterResource.Name
                            Write-Host "Current node is " $currentHostName

                            if ([string]::Compare($clusterResource.OwnerNode, $currentHostName, $True) -eq 0)
                            {
                                $isPrimaryNode = $True
                                Write-Host "Current node owns VMM cluster resource"
                                Write-Host "Shutting VMM Cluster Resource down"
                                Stop-ClusterResource $clusterResource
                            }
                            else
                            {
                                Write-Error "Current node does not own VMM cluster resource. Please run on this script on $clusterResource.OwnerNode"
                                Exit
                            }

                            break
                        }
                    }
                }
            }
            else
            {
                Write-Error “Failed to find registry keys associated with VMM”
                return
            }

            ""
            "Connect to SCVMM database using"
            "1. Windows Authentication"
            "2. SQL Server Authentication"

            $mode =  Read-Host "Enter your choice "
            ""

            cd 'hklm:\software\Microsoft\Microsoft System Center Virtual Machine Manager Server\Settings\Sql'
            $connectionString = get-itemproperty . -Name ConnectionString
            $conn = New-Object System.Data.SqlClient.SqlConnection

            if($mode -eq 1)
            {
            "Connecting to SQL via Windows Authentication..."
            $conn.ConnectionString = $connectionString.ConnectionString
            }
            else
            {
                "Connecting to SQL via SQL Server Authentication..."

                $credential = Get-Credential
                $loginName = $credential.UserName
                $password = $credential.password
                $password.MakeReadOnly();
                $conn.ConnectionString = $connectionString.ConnectionString.ToString().split(";",2)[1]
                $sqlcred = New-Object System.Data.SqlClient.SqlCredential($loginName, $password)
                $conn.Credential = $sqlcred
            }

            Write-Host "Connection string: " $conn.ConnectionString
            $conn.Open()
            $transaction = $conn.BeginTransaction("CleanupTransaction");

            try
            {
                $sql = "SELECT TOP 1 [Id]
                        FROM [sysobjects]
                        WHERE [Name] = 'tbl_DR_ProtectionUnit'
                        AND [xType] = 'U'"
                $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                $cmd.Transaction = $transaction
                $rdr = $cmd.ExecuteReader()
                $PUTableExists = $rdr.HasRows
                $rdr.Close()
                $SCVMM2012R2Detected = $false
                if($PUTableExists)
                {
                    $sql = "SELECT [Id]
                            FROM [tbl_DR_ProtectionUnit]"
                    $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                    $cmd.Transaction = $transaction
                    $rdr = $cmd.ExecuteReader()
                    $SCVMM2012R2Detected = $rdr.HasRows
                    $rdr.Close()
                }

                ""
                "Getting all clouds configured for protection..."

                $sql = "SELECT [PrimaryCloudID],
                            [RecoveryCloudID],
                            [PrimaryCloudName],
                            [RecoveryCloudName]
                        FROM [tbl_Cloud_CloudDRPairing]
                        WHERE [PrimaryVMMID] = @VMMId
                        OR [RecoveryVMMID] = @VMMId"
                $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)

                $cmd.Parameters.AddWithValue("@VMMId",$vmmid) | Out-Null
                $cmd.Transaction = $transaction
                $da = New-Object System.Data.SqlClient.SqlDataAdapter
                $da.SelectCommand = $cmd
                $ds = New-Object System.Data.DataSet
                $da.Fill($ds, "Clouds") | Out-Null

                if($ds.Tables["Clouds"].Rows.Count -eq 0 )
                {
                    "No clouds were found in protected or protecting status."
                }
                else
                {
                    "Cloud pairing list populated."

                    ""
                    "Listing the clouds and their VMs..."

                    $vmIds = @()

                    foreach ($row in $ds.tables["Clouds"].rows)
                    {
                        ""                    
                        "'{0}' protected by '{1}'" -f $row.PrimaryCloudName.ToString(), $row.RecoveryCloudName.ToString()

                        $sql = "SELECT [ObjectId],
                                    [Name]
                                FROM [tbl_WLC_VObject]
                                WHERE [CloudId] IN (@PrimaryCloudId,@RecoveryCloudId)"
                        $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                        $cmd.Transaction = $transaction
                        $cmd.Parameters.AddWithValue("@PrimaryCloudId",$row.PrimaryCloudId.ToString()) | Out-Null
                        $cmd.Parameters.AddWithValue("@RecoveryCloudId",$row.RecoveryCloudId.ToString()) | Out-Null
                        $rdr = $cmd.ExecuteReader()
                        if($rdr.HasRows)
                        {
                            "VM list:"
                        }
                        else
                        {
                            "No VMs found."
                        }
                        while($rdr.Read())
                        {
                            Write-Host $rdr["Name"].ToString()
                            $vmIds = $vmIds + $rdr["ObjectId"].ToString();
                        }

                        $rdr.Close()
                    }


                    if($vmIds.Count -eq 0)
                    {
                        "No protected VMs are present."
                    }
                    else
                    {
                        ""
                        "Removing recovery settings from all protected VMs..."

                        if($SCVMM2012R2Detected)
                        {
                            $sql = "UPDATE vm
                                    SET [DRState] = 0,
                                        [DRErrors] = NULL,
                                        [ProtectionUnitId] = NULL
                                    FROM
                                        [tbl_WLC_VMInstance] vm
                                        INNER JOIN [tbl_WLC_VObject] vObj
                                        ON vm.[VMInstanceId] = vObj.[ObjectId]
                                        INNER JOIN [tbl_Cloud_CloudDRPairing] cpair
                                        ON vObj.[CloudId] = cpair.[PrimaryCloudID]
                                        OR vObj.[CloudId] = cpair.[RecoveryCloudID]
                                        WHERE cpair.[PrimaryVMMId] = @VMMId
                                        OR cpair.[RecoveryVMMID] = @VMMId"
                            $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                            $cmd.Transaction = $transaction
                            $cmd.Parameters.AddWithValue("@VMMId",$vmmid) | Out-Null
                            $cmd.ExecuteNonQuery() | Out-Null
                        }
                        else
                        {
                            $sql = "UPDATE vm
                                    SET [DRState] = 0,
                                        [DRErrors] = NULL
                                    FROM
                                        [tbl_WLC_VMInstance] vm
                                        INNER JOIN [tbl_WLC_VObject] vObj
                                        ON vm.[VMInstanceId] = vObj.[ObjectId]
                                        INNER JOIN [tbl_Cloud_CloudDRPairing] cpair
                                        ON vObj.[CloudId] = cpair.[PrimaryCloudID]
                                        OR vObj.[CloudId] = cpair.[RecoveryCloudID]
                                        WHERE cpair.[PrimaryVMMId] = @VMMId
                                        OR cpair.[RecoveryVMMID] = @VMMId"
                            $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                            $cmd.Transaction = $transaction
                            $cmd.Parameters.AddWithValue("@VMMId",$vmmid) | Out-Null
                            $cmd.ExecuteNonQuery() | Out-Null
                        }


                        $sql = "UPDATE hwp
                                SET [IsDRProtectionRequired] = 0
                                FROM
                                    [tbl_WLC_HWProfile] hwp
                                    INNER JOIN [tbl_WLC_VObject] vObj
                                    ON hwp.[HWProfileId] = vObj.[HWProfileId]
                                    INNER JOIN [tbl_Cloud_CloudDRPairing] cpair
                                    ON vObj.[CloudId] = cpair.[PrimaryCloudID]
                                    OR vObj.[CloudId] = cpair.[RecoveryCloudID]
                                    WHERE cpair.[PrimaryVMMId] = @VMMId
                                    OR cpair.[RecoveryVMMID] = @VMMId"
                        $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                        $cmd.Transaction = $transaction
                        $cmd.Parameters.AddWithValue("@VMMId",$vmmid) | Out-Null
                        $cmd.ExecuteNonQuery() | Out-Null

                        "Recovery settings removed successfully for {0} VMs" -f $vmIds.Count
                    }


                    ""
                    "Removing recovery settings from all clouds..."
                    if($SCVMM2012R2Detected)
                    {
                        if($fullCleanup -eq 1)
                        {
                            $sql = "DELETE phost
                                    FROM [tbl_DR_ProtectionUnit_HostRelation] phost
                                    INNER JOIN [tbl_Cloud_CloudScopeRelation] csr
                                    ON phost.[ProtectionUnitId] = csr.[ScopeId]
                                    WHERE csr.[ScopeType] = 214"
                            $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                            $cmd.Transaction = $transaction
                            $cmd.ExecuteNonQuery() | Out-Null


                            $sql = "UPDATE [tbl_Cloud_Cloud]
                                    SET [IsDRProtected] = 0,
                                        [IsDRProvider] = 0,
                                        [DisasterRecoverySupported] = 0"
                            $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                            $cmd.Transaction = $transaction
                            $cmd.ExecuteNonQuery() | Out-Null

                        }
                        else
                        {
                            $sql = "DELETE phost
                                    FROM [tbl_DR_ProtectionUnit_HostRelation] phost
                                    INNER JOIN [tbl_Cloud_CloudScopeRelation] csr
                                    ON phost.[ProtectionUnitId] = csr.[ScopeId]
                                    INNER JOIN [tbl_Cloud_CloudDRPairing] cpair
                                    ON csr.[CloudId] = cpair.[primaryCloudId]
                                    OR csr.[CloudId] = cpair.[recoveryCloudId]
                                    WHERE csr.ScopeType = 214
                                    AND cpair.[PrimaryVMMId] = @VMMId
                                    OR cpair.[RecoveryVMMID] = @VMMId"
                            $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                            $cmd.Transaction = $transaction
                            $cmd.Parameters.AddWithValue("@VMMId",$vmmid) | Out-Null
                            $cmd.ExecuteNonQuery() | Out-Null

                            $sql = "UPDATE cloud
                                    SET [IsDRProtected] = 0,
                                        [IsDRProvider] = 0
                                    FROM
                                        [tbl_Cloud_Cloud] cloud
                                        INNER JOIN [tbl_Cloud_CloudDRPairing] cpair
                                        ON cloud.[ID] = cpair.[PrimaryCloudID]
                                        OR cloud.[ID] = cpair.[RecoveryCloudID]
                                        WHERE cpair.[PrimaryVMMId] = @VMMId
                                        OR cpair.[RecoveryVMMID] = @VMMId"
                            $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                            $cmd.Transaction = $transaction
                            $cmd.Parameters.AddWithValue("@VMMId",$vmmid) | Out-Null
                            $cmd.ExecuteNonQuery() | Out-Null

                        }

                    }

                    # VMM 2012 SP1 detected.
                    else
                    {
                        $sql = "UPDATE cloud
                                SET [IsDRProtected] = 0,
                                    [IsDRProvider] = 0
                                FROM
                                    [tbl_Cloud_Cloud] cloud
                                    INNER JOIN [tbl_Cloud_CloudDRPairing] cpair
                                    ON cloud.[ID] = cpair.[PrimaryCloudID]
                                    OR cloud.[ID] = cpair.[RecoveryCloudID]
                                    WHERE cpair.[PrimaryVMMId] = @VMMId
                                    OR cpair.[RecoveryVMMID] = @VMMId"
                        $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                        $cmd.Transaction = $transaction
                        $cmd.Parameters.AddWithValue("@VMMId",$vmmid) | Out-Null
                        $cmd.ExecuteNonQuery() | Out-Null
                    }

                    "Recovery settings removed successfully."

                    ""
                    "Deleting cloud pairing entities..."

                    $sql = "DELETE FROM [tbl_Cloud_CloudDRPairing]
                            WHERE [PrimaryVMMID] = @VMMId
                            OR [RecoveryVMMID] = @VMMId"
                    $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                    $cmd.Transaction = $transaction
                    $cmd.Parameters.AddWithValue("@VMMId",$vmmid) | Out-Null
                    $cmd.ExecuteNonQuery() | Out-Null

                    "Cloud pairing entities deleted successfully."
                }


                if ($SCVMM2012R2Detected)
                {
                    "Removing SAN related entries"

                    $sql = "DELETE sanMap
                                    FROM [tbl_DR_ProtectionUnit_StorageArray] sanMap
                                    INNER JOIN [tbl_Cloud_CloudScopeRelation] csr
                                    ON sanMap.[ProtectionUnitId] = csr.[ScopeId]
                                    WHERE csr.[ScopeType] = 214"
                            $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                            $cmd.Transaction = $transaction
                            $cmd.ExecuteNonQuery() | Out-Null

                    "SAN related entities deleted successfully"
                }


                if($fullCleanup -eq 1)
                {
                    # In case of full cleanup reset all VMs protection data.
                    ""
                    "Removing stale entries for VMs..."
                    if($SCVMM2012R2Detected)
                    {
                        $sql = "UPDATE [tbl_WLC_VMInstance]
                                SET [DRState] = 0,
                                    [DRErrors] = NULL,
                                    [ProtectionUnitId] = NULL"
                        $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                        $cmd.Transaction = $transaction
                        $cmd.ExecuteNonQuery() | Out-Null
                    }
                    else
                    {
                        $sql = "UPDATE [tbl_WLC_VMInstance]
                                SET [DRState] = 0,
                                    [DRErrors] = NULL"
                        $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                        $cmd.Transaction = $transaction
                        $cmd.ExecuteNonQuery() | Out-Null
                    }


                    $sql = "UPDATE [tbl_WLC_HWProfile]
                            SET [IsDRProtectionRequired] = 0"
                    $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                    $cmd.Transaction = $transaction
                    $cmd.ExecuteNonQuery() | Out-Null
                    # Done removing stale enteries

                    # Cloud publish settings and registration details are cleaned up even if there are no paired clouds.
                    if($SCVMM2012R2Detected)
                    {
                        ""
                        "Removing cloud publish settings..."

                        # Currently 214 scopeType points to only ProtectionProvider = 1,2 (HVR1 and HVR2).
                        # Once new providers are introduced appropriate filtering should be done before delete
                        # in below two queries.
                        $sql = "DELETE punit
                                FROM [tbl_DR_ProtectionUnit] punit
                                INNER JOIN [tbl_Cloud_CloudScopeRelation] csr
                                ON punit.[ID] = csr.[ScopeId]
                                WHERE csr.[ScopeType] = 214"
                        $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                        $cmd.Transaction = $transaction
                        $cmd.ExecuteNonQuery() | Out-Null


                        $sql = "DELETE FROM [tbl_Cloud_CloudScopeRelation]
                                WHERE [ScopeType] = 214"
                        $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                        $cmd.Transaction = $transaction
                        $cmd.ExecuteNonQuery() | Out-Null
                        "Cloud publish settings removed successfully."
                    }

                    ""
                    "Un-registering VMM..."

                    $currentTime = Get-Date
                    $sql = "UPDATE [tbl_DR_VMMRegistrationDetails]
                            SET [DRSubscriptionId] = '',
                                [VMMFriendlyName] = '',
                                [DRAdapterInstalledVersion] = '',
                                [LastModifiedDate] = @LastModifiedTime,
                                [DRAuthCertBlob] = NULL,
                                [DRAuthCertThumbprint] = NULL,
                                [HostSigningCertBlob] = NULL,
                                [HostSigningCertThumbprint] = NULL,
                                [DRAdapterUpdateVersion] = '',
                                [OrgIdUserName] = ''
                            WHERE [VMMId] = @VMMId"
                    $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                    $cmd.Transaction = $transaction
                    $param1 = $cmd.Parameters.AddWithValue("@LastModifiedTime", [System.Data.SqlDbType]::DateTime)
                    $param1.Value = Get-Date
                    $cmd.Parameters.AddWithValue("@VMMId",$vmmid) | Out-Null
                    $cmd.ExecuteNonQuery() | Out-Null

                    "Un-registration completed successfully."

                    ""
                    "Removing KEK..."

                    $kekid = "06cda9f3-2e3d-49ee-8e18-2d9bd1d74034"
                    $rolloverKekId = "fe0adfd7-309a-429a-b420-e8ed067338e6"
                    $sql = "DELETE FROM [tbl_VMM_CertificateStore]
                            WHERE [CertificateID] IN (@KEKId,@RolloverKekId)"
                    $cmd = New-Object System.Data.SqlClient.SqlCommand($sql,$conn)
                    $cmd.Transaction = $transaction
                    $cmd.Parameters.AddWithValue("@KEKId",$kekid) | Out-Null
                    $cmd.Parameters.AddWithValue("@RolloverKekId",$rolloverKekId) | Out-Null
                    $cmd.ExecuteNonQuery() | Out-Null

                    "Removing KEK completed successfully."

                    if($error.Count -eq 0)
                    {
                        $transaction.Commit()

                        ""
                        "Removing registration related registry keys."

                        $path = "software\Microsoft\Microsoft System Center Virtual Machine Manager Server\DRAdapter\Registration"
                        if((Test-Path "hklm:\$path" ))
                        {
                            if($isCluster -and $isPrimaryNode)
                            {
                                foreach($checkpoint in $clusterCheckpointList)
                                {
                                    $compareResult = [string]::Compare($path, $checkpoint.Name, $True)

                                    if($compareResult -eq 0)
                                    {
                                        Write-Host "Removing Checkpointing for $path"
                                        Remove-ClusterCheckpoint -CheckpointName $path
                                    }
                                }
                            }

                            Remove-Item -Path "hklm:\$path"

                            $proxyPath = "software\Microsoft\Microsoft System Center Virtual Machine Manager Server\DRAdapter\ProxySettings"
                            if((Test-Path "hklm:\$proxyPath"))
                            {
                                if($isCluster -and $isPrimaryNode)
                                {
                                    foreach($checkpoint in $clusterCheckpointList)
                                    {
                                        $compareResult = [string]::Compare($proxyPath, $checkpoint.Name, $True)

                                        if($compareResult -eq 0)
                                        {
                                            Write-Host "Removing Checkpointing for $proxyPath"
                                            Remove-ClusterCheckpoint -CheckpointName $proxyPath
                                        }
                                    }
                                }

                                Remove-Item -Path "hklm:\$proxyPath"
                            }

                            $backupPath = "software\Microsoft\Hyper-V Recovery Manager"
                            if((Test-Path "hklm:\$backupPath"))
                            {
                                if($isCluster -and $isPrimaryNode)
                                {
                                    foreach($checkpoint in $clusterCheckpointList)
                                    {
                                        $compareResult = [string]::Compare($backupPath, $checkpoint.Name, $True)

                                        if($compareResult -eq 0)
                                        {
                                            Write-Host "Removing Checkpointing for $backupPath"
                                            Remove-ClusterCheckpoint -CheckpointName $backupPath
                                        }
                                    }
                                }
                                Remove-Item "hklm:\$backupPath" -recurse
                            }
                            "Registry keys removed successfully."
                            ""
                        }
                        else
                        {
                            "Could not delete registration key as hklm:\software\Microsoft\Microsoft System Center Virtual Machine Manager Server\DRAdapter\Registration doesn't exist."
                        }

                        Write-Host "SUCCESS!!" -ForegroundColor "Green"
                    }
                    else
                    {
                        $transaction.Rollback()
                        Write-Error "Error occured"
                        $error[0]
                        ""
                        Write-Error "FAILED"
                        "All updates to the VMM database have been rolled back."
                    }
                }
                else
                {
                    if($error.Count -eq 0)
                    {
                        $transaction.Commit()
                        Write-Host "SUCCESS!!" -ForegroundColor "Green"
                    }
                    else
                    {
                        $transaction.Rollback()
                        Write-Error "FAILED"
                    }
                }

                $conn.Close()
            }
            catch
            {
                $transaction.Rollback()
                Write-Host "Error occurred" -ForegroundColor "Red"
                $error[0]
                Write-Error "FAILED"
                "All updates to the VMM database have been rolled back."
            }
        }
    }
    else
    {
        Write-Error "VMM Id is missing from hklm:\software\Microsoft\Microsoft System Center Virtual Machine Manager Server\Setup or VMMId is not provided."
        Write-Error "FAILED" -ForegroundColor
    }
}

catch
{
    Write-Error "Error occurred"
    $error[0]
    Write-Error "FAILED"
}

if($isCluster)
{
    if($clusterResource.State -eq [Microsoft.FailoverClusters.PowerShell.ClusterResourceState]::Offline)
    {
        Write-Host "Cluster role is in stopped state."
    }
    else
    {
        Write-Host "Operation completed. Cluster role was not stopped."
    }
}
else
{
    Write-Host "The VMM service is in stopped state."
}

popd
# SIG # Begin signature block
# MIId0wYJKoZIhvcNAQcCoIIdxDCCHcACAQExCzAJBgUrDgMCGgUAMGkGCisGAQQB
# gjcCAQSgWzBZMDQGCisGAQQBgjcCAR4wJgIDAQAABBAfzDtgWUsITrck0sYpfvNR
# AgEAAgEAAgEAAgEAAgEAMCEwCQYFKw4DAhoFAAQU3rRWHH5OCASnIAZsmgmowP/T
# p6egghhkMIIEwzCCA6ugAwIBAgITMwAAAIgVUlHPFzd7VQAAAAAAiDANBgkqhkiG
# 9w0BAQUFADB3MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
# A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSEw
# HwYDVQQDExhNaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EwHhcNMTUxMDA3MTgxNDAx
# WhcNMTcwMTA3MTgxNDAxWjCBszELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
# bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
# b3JhdGlvbjENMAsGA1UECxMETU9QUjEnMCUGA1UECxMebkNpcGhlciBEU0UgRVNO
# OjdBRkEtRTQxQy1FMTQyMSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBT
# ZXJ2aWNlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyBEjpkOcrwAm
# 9WRMNBv90OUqsqL7/17OvrhGMWgwAsx3sZD0cMoNxrlfHwNfCNopwH0z7EI3s5gQ
# Z4Pkrdl9GjQ9/FZ5uzV24xfhdq/u5T2zrCXC7rob9FfhBtyTI84B67SDynCN0G0W
# hJaBW2AFx0Dn2XhgYzpvvzk4NKZl1NYi0mHlHSjWfaqbeaKmVzp9JSfmeaW9lC6s
# IgqKo0FFZb49DYUVdfbJI9ECTyFEtUaLWGchkBwj9oz62u9Kg6sh3+UslWTY4XW+
# 7bBsN3zC430p0X7qLMwQf+0oX7liUDuszCp828HsDb4pu/RRyv+KOehVKx91UNcr
# Dc9Z7isNeQIDAQABo4IBCTCCAQUwHQYDVR0OBBYEFJQRxg5HoMTIdSZj1v3l1GjM
# 6KEMMB8GA1UdIwQYMBaAFCM0+NlSRnAK7UD7dvuzK7DDNbMPMFQGA1UdHwRNMEsw
# SaBHoEWGQ2h0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3Rz
# L01pY3Jvc29mdFRpbWVTdGFtcFBDQS5jcmwwWAYIKwYBBQUHAQEETDBKMEgGCCsG
# AQUFBzAChjxodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY3Jv
# c29mdFRpbWVTdGFtcFBDQS5jcnQwEwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZI
# hvcNAQEFBQADggEBAHoudDDxFsg2z0Y+GhQ91SQW1rdmWBxJOI5OpoPzI7P7X2dU
# ouvkmQnysdipDYER0xxkCf5VAz+dDnSkUQeTn4woryjzXBe3g30lWh8IGMmGPWhq
# L1+dpjkxKbIk9spZRdVH0qGXbi8tqemmEYJUW07wn76C+wCZlbJnZF7W2+5g9MZs
# RT4MAxpQRw+8s1cflfmLC5a+upyNO3zBEY2gaBs1til9O7UaUD4OWE4zPuz79AJH
# 9cGBQo8GnD2uNFYqLZRx3T2X+AVt/sgIHoUSK06fqVMXn1RFSZT3jRL2w/tD5uef
# 4ta/wRmAStRMbrMWYnXAeCJTIbWuE2lboA3IEHIwggYHMIID76ADAgECAgphFmg0
# AAAAAAAcMA0GCSqGSIb3DQEBBQUAMF8xEzARBgoJkiaJk/IsZAEZFgNjb20xGTAX
# BgoJkiaJk/IsZAEZFgltaWNyb3NvZnQxLTArBgNVBAMTJE1pY3Jvc29mdCBSb290
# IENlcnRpZmljYXRlIEF1dGhvcml0eTAeFw0wNzA0MDMxMjUzMDlaFw0yMTA0MDMx
# MzAzMDlaMHcxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
# VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xITAf
# BgNVBAMTGE1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQTCCASIwDQYJKoZIhvcNAQEB
# BQADggEPADCCAQoCggEBAJ+hbLHf20iSKnxrLhnhveLjxZlRI1Ctzt0YTiQP7tGn
# 0UytdDAgEesH1VSVFUmUG0KSrphcMCbaAGvoe73siQcP9w4EmPCJzB/LMySHnfL0
# Zxws/HvniB3q506jocEjU8qN+kXPCdBer9CwQgSi+aZsk2fXKNxGU7CG0OUoRi4n
# rIZPVVIM5AMs+2qQkDBuh/NZMJ36ftaXs+ghl3740hPzCLdTbVK0RZCfSABKR2YR
# JylmqJfk0waBSqL5hKcRRxQJgp+E7VV4/gGaHVAIhQAQMEbtt94jRrvELVSfrx54
# QTF3zJvfO4OToWECtR0Nsfz3m7IBziJLVP/5BcPCIAsCAwEAAaOCAaswggGnMA8G
# A1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFCM0+NlSRnAK7UD7dvuzK7DDNbMPMAsG
# A1UdDwQEAwIBhjAQBgkrBgEEAYI3FQEEAwIBADCBmAYDVR0jBIGQMIGNgBQOrIJg
# QFYnl+UlE/wq4QpTlVnkpKFjpGEwXzETMBEGCgmSJomT8ixkARkWA2NvbTEZMBcG
# CgmSJomT8ixkARkWCW1pY3Jvc29mdDEtMCsGA1UEAxMkTWljcm9zb2Z0IFJvb3Qg
# Q2VydGlmaWNhdGUgQXV0aG9yaXR5ghB5rRahSqClrUxzWPQHEy5lMFAGA1UdHwRJ
# MEcwRaBDoEGGP2h0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1
# Y3RzL21pY3Jvc29mdHJvb3RjZXJ0LmNybDBUBggrBgEFBQcBAQRIMEYwRAYIKwYB
# BQUHMAKGOGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljcm9z
# b2Z0Um9vdENlcnQuY3J0MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEB
# BQUAA4ICAQAQl4rDXANENt3ptK132855UU0BsS50cVttDBOrzr57j7gu1BKijG1i
# uFcCy04gE1CZ3XpA4le7r1iaHOEdAYasu3jyi9DsOwHu4r6PCgXIjUji8FMV3U+r
# kuTnjWrVgMHmlPIGL4UD6ZEqJCJw+/b85HiZLg33B+JwvBhOnY5rCnKVuKE5nGct
# xVEO6mJcPxaYiyA/4gcaMvnMMUp2MT0rcgvI6nA9/4UKE9/CCmGO8Ne4F+tOi3/F
# NSteo7/rvH0LQnvUU3Ih7jDKu3hlXFsBFwoUDtLaFJj1PLlmWLMtL+f5hYbMUVbo
# nXCUbKw5TNT2eb+qGHpiKe+imyk0BncaYsk9Hm0fgvALxyy7z0Oz5fnsfbXjpKh0
# NbhOxXEjEiZ2CzxSjHFaRkMUvLOzsE1nyJ9C/4B5IYCeFTBm6EISXhrIniIh0EPp
# K+m79EjMLNTYMoBMJipIJF9a6lbvpt6Znco6b72BJ3QGEe52Ib+bgsEnVLaxaj2J
# oXZhtG6hE6a/qkfwEm/9ijJssv7fUciMI8lmvZ0dhxJkAj0tr1mPuOQh5bWwymO0
# eFQF1EEuUKyUsKV4q7OglnUa2ZKHE3UiLzKoCG6gW4wlv6DvhMoh1useT8ma7kng
# 9wFlb4kLfchpyOZu6qeXzjEp/w7FW1zYTRuh2Povnj8uVRZryROj/TCCBhAwggP4
# oAMCAQICEzMAAABkR4SUhttBGTgAAAAAAGQwDQYJKoZIhvcNAQELBQAwfjELMAkG
# A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
# HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYGA1UEAxMfTWljcm9z
# b2Z0IENvZGUgU2lnbmluZyBQQ0EgMjAxMTAeFw0xNTEwMjgyMDMxNDZaFw0xNzAx
# MjgyMDMxNDZaMIGDMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
# MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
# MQ0wCwYDVQQLEwRNT1BSMR4wHAYDVQQDExVNaWNyb3NvZnQgQ29ycG9yYXRpb24w
# ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCTLtrY5j6Y2RsPZF9NqFhN
# FDv3eoT8PBExOu+JwkotQaVIXd0Snu+rZig01X0qVXtMTYrywPGy01IVi7azCLiL
# UAvdf/tqCaDcZwTE8d+8dRggQL54LJlW3e71Lt0+QvlaHzCuARSKsIK1UaDibWX+
# 9xgKjTBtTTqnxfM2Le5fLKCSALEcTOLL9/8kJX/Xj8Ddl27Oshe2xxxEpyTKfoHm
# 5jG5FtldPtFo7r7NSNCGLK7cDiHBwIrD7huTWRP2xjuAchiIU/urvzA+oHe9Uoi/
# etjosJOtoRuM1H6mEFAQvuHIHGT6hy77xEdmFsCEezavX7qFRGwCDy3gsA4boj4l
# AgMBAAGjggF/MIIBezAfBgNVHSUEGDAWBggrBgEFBQcDAwYKKwYBBAGCN0wIATAd
# BgNVHQ4EFgQUWFZxBPC9uzP1g2jM54BG91ev0iIwUQYDVR0RBEowSKRGMEQxDTAL
# BgNVBAsTBE1PUFIxMzAxBgNVBAUTKjMxNjQyKzQ5ZThjM2YzLTIzNTktNDdmNi1h
# M2JlLTZjOGM0NzUxYzRiNjAfBgNVHSMEGDAWgBRIbmTlUAXTgqoXNzcitW2oynUC
# lTBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
# b3BzL2NybC9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDctMDguY3JsMGEGCCsGAQUF
# BwEBBFUwUzBRBggrBgEFBQcwAoZFaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3Br
# aW9wcy9jZXJ0cy9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDctMDguY3J0MAwGA1Ud
# EwEB/wQCMAAwDQYJKoZIhvcNAQELBQADggIBAIjiDGRDHd1crow7hSS1nUDWvWas
# W1c12fToOsBFmRBN27SQ5Mt2UYEJ8LOTTfT1EuS9SCcUqm8t12uD1ManefzTJRtG
# ynYCiDKuUFT6A/mCAcWLs2MYSmPlsf4UOwzD0/KAuDwl6WCy8FW53DVKBS3rbmdj
# vDW+vCT5wN3nxO8DIlAUBbXMn7TJKAH2W7a/CDQ0p607Ivt3F7cqhEtrO1Rypehh
# bkKQj4y/ebwc56qWHJ8VNjE8HlhfJAk8pAliHzML1v3QlctPutozuZD3jKAO4WaV
# qJn5BJRHddW6l0SeCuZmBQHmNfXcz4+XZW/s88VTfGWjdSGPXC26k0LzV6mjEaEn
# S1G4t0RqMP90JnTEieJ6xFcIpILgcIvcEydLBVe0iiP9AXKYVjAPn6wBm69FKCQr
# IPWsMDsw9wQjaL8GHk4wCj0CmnixHQanTj2hKRc2G9GL9q7tAbo0kFNIFs0EYkbx
# Cn7lBOEqhBSTyaPS6CvjJZGwD0lNuapXDu72y4Hk4pgExQ3iEv/Ij5oVWwT8okie
# +fFLNcnVgeRrjkANgwoAyX58t0iqbefHqsg3RGSgMBu9MABcZ6FQKwih3Tj0DVPc
# gnJQle3c6xN3dZpuEgFcgJh/EyDXSdppZzJR4+Bbf5XA/Rcsq7g7X7xl4bJoNKLf
# cafOabJhpxfcFOowMIIHejCCBWKgAwIBAgIKYQ6Q0gAAAAAAAzANBgkqhkiG9w0B
# AQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
# BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAG
# A1UEAxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IDIwMTEw
# HhcNMTEwNzA4MjA1OTA5WhcNMjYwNzA4MjEwOTA5WjB+MQswCQYDVQQGEwJVUzET
# MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
# TWljcm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
# aWduaW5nIFBDQSAyMDExMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA
# q/D6chAcLq3YbqqCEE00uvK2WCGfQhsqa+laUKq4BjgaBEm6f8MMHt03a8YS2Avw
# OMKZBrDIOdUBFDFC04kNeWSHfpRgJGyvnkmc6Whe0t+bU7IKLMOv2akrrnoJr9eW
# WcpgGgXpZnboMlImEi/nqwhQz7NEt13YxC4Ddato88tt8zpcoRb0RrrgOGSsbmQ1
# eKagYw8t00CT+OPeBw3VXHmlSSnnDb6gE3e+lD3v++MrWhAfTVYoonpy4BI6t0le
# 2O3tQ5GD2Xuye4Yb2T6xjF3oiU+EGvKhL1nkkDstrjNYxbc+/jLTswM9sbKvkjh+
# 0p2ALPVOVpEhNSXDOW5kf1O6nA+tGSOEy/S6A4aN91/w0FK/jJSHvMAhdCVfGCi2
# zCcoOCWYOUo2z3yxkq4cI6epZuxhH2rhKEmdX4jiJV3TIUs+UsS1Vz8kA/DRelsv
# 1SPjcF0PUUZ3s/gA4bysAoJf28AVs70b1FVL5zmhD+kjSbwYuER8ReTBw3J64HLn
# JN+/RpnF78IcV9uDjexNSTCnq47f7Fufr/zdsGbiwZeBe+3W7UvnSSmnEyimp31n
# gOaKYnhfsi+E11ecXL93KCjx7W3DKI8sj0A3T8HhhUSJxAlMxdSlQy90lfdu+Hgg
# WCwTXWCVmj5PM4TasIgX3p5O9JawvEagbJjS4NaIjAsCAwEAAaOCAe0wggHpMBAG
# CSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBRIbmTlUAXTgqoXNzcitW2oynUClTAZ
# BgkrBgEEAYI3FAIEDB4KAFMAdQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/
# BAUwAwEB/zAfBgNVHSMEGDAWgBRyLToCMZBDuRQFTuHqp8cx0SOJNDBaBgNVHR8E
# UzBRME+gTaBLhklodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9k
# dWN0cy9NaWNSb29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3JsMF4GCCsGAQUFBwEB
# BFIwUDBOBggrBgEFBQcwAoZCaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9j
# ZXJ0cy9NaWNSb29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3J0MIGfBgNVHSAEgZcw
# gZQwgZEGCSsGAQQBgjcuAzCBgzA/BggrBgEFBQcCARYzaHR0cDovL3d3dy5taWNy
# b3NvZnQuY29tL3BraW9wcy9kb2NzL3ByaW1hcnljcHMuaHRtMEAGCCsGAQUFBwIC
# MDQeMiAdAEwAZQBnAGEAbABfAHAAbwBsAGkAYwB5AF8AcwB0AGEAdABlAG0AZQBu
# AHQALiAdMA0GCSqGSIb3DQEBCwUAA4ICAQBn8oalmOBUeRou09h0ZyKbC5YR4WOS
# mUKWfdJ5DJDBZV8uLD74w3LRbYP+vj/oCso7v0epo/Np22O/IjWll11lhJB9i0ZQ
# VdgMknzSGksc8zxCi1LQsP1r4z4HLimb5j0bpdS1HXeUOeLpZMlEPXh6I/MTfaaQ
# dION9MsmAkYqwooQu6SpBQyb7Wj6aC6VoCo/KmtYSWMfCWluWpiW5IP0wI/zRive
# /DvQvTXvbiWu5a8n7dDd8w6vmSiXmE0OPQvyCInWH8MyGOLwxS3OW560STkKxgrC
# xq2u5bLZ2xWIUUVYODJxJxp/sfQn+N4sOiBpmLJZiWhub6e3dMNABQamASooPoI/
# E01mC8CzTfXhj38cbxV9Rad25UAqZaPDXVJihsMdYzaXht/a8/jyFqGaJ+HNpZfQ
# 7l1jQeNbB5yHPgZ3BtEGsXUfFL5hYbXw3MYbBL7fQccOKO7eZS/sl/ahXJbYANah
# Rr1Z85elCUtIEJmAH9AAKcWxm6U/RXceNcbSoqKfenoi+kiVH6v7RyOA9Z74v2u3
# S5fi63V4GuzqN5l5GEv/1rMjaHXmr/r8i+sLgOppO6/8MO0ETI7f33VtY5E90Z1W
# Tk+/gFcioXgRMiF670EKsT/7qMykXcGhiJtXcVZOSEXAQsmbdlsKgEhr/Xmfwb1t
# bWrJUnMTDXpQzTGCBNkwggTVAgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
# EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
# ZnQgQ29ycG9yYXRpb24xKDAmBgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcg
# UENBIDIwMTECEzMAAABkR4SUhttBGTgAAAAAAGQwCQYFKw4DAhoFAKCB7TAZBgkq
# hkiG9w0BCQMxDAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYKKwYBBAGC
# NwIBFTAjBgkqhkiG9w0BCQQxFgQUBdBqDyVXnqZzMp1OJYf3joRoaTAwgYwGCisG
# AQQBgjcCAQwxfjB8oE6ATABNAGkAYwByAG8AcwBvAGYAdAAgAEEAegB1AHIAZQAg
# AFMAaQB0AGUAIABSAGUAYwBvAHYAZQByAHkAIABQAHIAbwB2AGkAZABlAHKhKoAo
# aHR0cDovL2dvLm1pY3Jvc29mdC5jb20vP2xpbmtpZD05ODI3Mzk1IDANBgkqhkiG
# 9w0BAQEFAASCAQBTkB941lb+sBGlUfrKY0rio8iWs3zcjnJUshSKfimD2pJLYdHx
# hiBkoWXz/nM5ruhKh9Iu62xvqNNTDLt5H2PxvjCrH0v3TpSaRp6QnxIzIKSgtUnT
# /nxqpvT8QMbecpHXKARw+WcDlZBZWv5PZBoJBytoT+hRuYFOlUsVH7emimic9BlI
# lW+yX8Ip9txXOOoQluBgkIJ59fpNGS+p3t/hxwaYWSiOD5J+Ug7IELRmg1PfiCMW
# bg5hXYbvl18qaWFZIf3AXlY+22rYZvx0/hHwqLr/ULNDXF/ylMct2mxzzspN1u9P
# cJGLbFcxDNaxxzxEEY6ZVup1ycgI59W+16USoYICKDCCAiQGCSqGSIb3DQEJBjGC
# AhUwggIRAgEBMIGOMHcxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9u
# MRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
# b24xITAfBgNVBAMTGE1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQQITMwAAAIgVUlHP
# Fzd7VQAAAAAAiDAJBgUrDgMCGgUAoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEH
# ATAcBgkqhkiG9w0BCQUxDxcNMTYwMzIyMTg0OTUwWjAjBgkqhkiG9w0BCQQxFgQU
# Urmh+SC+zZzOARYhxu4k2PZFcIIwDQYJKoZIhvcNAQEFBQAEggEAW1kLw6IKNCm6
# 1nvELi0fHxB898JSoh+eRpVzm+ffOmTEiRqT3S0VZB24U6/FUkMwbNsRcRXeQ4aP
# RXHHlz2OtrHw/SCdNxFZQ6/4Kq/2a0VQRUtZKe4gZ+rQb7TX3axUf1A0FXTmZg0m
# 9wX8uiww0tsdrfEVQiluLrLdypGhFppZbf3T1/OlC11udPPfzfRN3HrKBuuYpCKx
# 8BzNYjCNRbGtsRjYTKQABuGtnTc+XrsLR6qPStI2sjS8qKVN155xu048VBK6FXLt
# RnrqKUMM6fsMKnWQwjoBauyFe54/p22HKQskWNwmHOg1CSOC31z9XaPkL3FHT+U4
# EUkEgDZz3A==
# SIG # End signature block

```
