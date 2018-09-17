---
title: Configure replication for Azure disk encryption (ADE) enabled VMs in Azure Site Recovery | Microsoft Docs
description: This article describes how to configure replication for ADE VMs, from one Azure region to another using Site Recovery.
services: site-recovery
author: sujayt
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 09/14/2018
ms.author: sutalasi

---


# Replicate Azure disk encryption (ADE) enabled virtual machines to another Azure region

This article describes how to enable replication of Azure disk encryption (ADE) enabled VMs, from one Azure region to another.

## Prerequisites

This article assumes that you've already set up Site Recovery for this scenario, as described in the [Azure to Azure tutorial](azure-to-azure-tutorial-enable-replication.md). Make sure that you've prepared the prerequisites, and created the Recovery Services vault.

### Required user permissions

To enable replication of ADE VMs from portal, the user should have the below permissions.
- Key vault permissions
    - list
    - Create
    - Get

-	Key vault secret permissions
    - List
    - Create
    - Get

- Key vault key permissions (required only if the VMs use Key Encryption Key to encrypt Disk Encryption keys)
    - List
    - Get
    - Create
    - Encrypt
    - Decrypt

You can manage the permissions by navigating to key vault resource in portal and adding the required permissions to the user.

    ![keyvaultpermissions](./media/azure-to-azure-how-to-enable-replication-ade-vms/keyvaultpermissions.png)

If the user enabling disaster recovery (DR) does not have the required permissions to copy the keys, the below script can be given to the security administrator with appropriate permissions to copy the encryption secrets and keys to the target region.

>[!NOTE]
>To enable replication of ADE VM from portal, you at least need "List" permissions on the key vaults, secrets and keys
>

### Script to copy ADE keys to the DR region

1. Copy the below script to a file and name it 'Copy-keys.ps1'.
    ```powershell
    ### +--------------------------------------------------------------
    ### <script name=CopyKeys>
    ### <summary>
    ### This script copies the disk encryption keys and key encryption
    ### keys for Azure Disk Encryption (ADE) enabled VMs from the source
    ### region to disaster recovery (DR) region. Azure Site Recovery requires
    ### the keys to enable replication for these VMs to another region.
    ### </summary>
    ###
    ### <param name="Verbose">Optional parameter to enable verbose logging messages.</param>
    ###
    ### ---------------------------------------------------------------

    [CmdletBinding()]
    param()

    # Settings and assemblies
    #Requires -Modules @{ ModuleName="AzureRM"; ModuleVersion="6.8.1" }
    Set-StrictMode -Version 1.0
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.Application]::EnableVisualStyles()

    ### <summary>
    ### Displays messages when cursor hovers over UI objects.
    ### </summary>
    function Show-Help
    {
        $InfoToolTip.SetToolTip($this, $this.Tag)
    }

    ### <summary>
    ### Gets list of resource groups for selected subscription and populates dropdown.
    ### </summary>
    function Get-ResourceGroups
    {
        $SubscriptionName = $this.SelectedItem.ToString()
        if ($SubscriptionName)
        {
            $LoadingLabel.Text = "Loading resource groups"

            Select-AzureRmSubscription -SubscriptionName $SubscriptionName
            $ResourceProvider = Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute

            # Locations taken from resource type: availabilitySets instead of resource type: Virtual machines,
            # just to stay in parallel with the Portal.
            $Locations = ($ResourceProvider[0].Locations) | % { $_.Split(' ').tolower() -join ''} | sort
            $ResourceGroupLabel = $FormElements["ResourceGroupLabel"]
            $ResourceGroupDropDown = $FormElements["ResourceGroupDropDown"]
            $VmListBox = $FormElements["VmListBox"]
            $LocationDropDown = $FormElements["LocationDropDown"]
            $ResourceGroupLabel.Enabled = $true
            $ResourceGroupDropDown.Enabled = $true
            $ResourceGroupDropDown.Items.Clear()
            $VmListBox.Items.Clear()
            $LocationDropDown.Items.Clear()
            $ResourceGroupDropDown.Text = ""

            [array]$ResourceGroupArray = (Get-AzureRmResourceGroup).ResourceGroupName | sort

            foreach ($Item in $ResourceGroupArray)
            {
                $SuppressOutput = $ResourceGroupDropDown.Items.Add($Item)
            }

            if($ResourceGroupArray)
            {
                $Longest = ($ResourceGroupArray | sort Length -Descending)[0]
                $ResourceGroupDropDown.DropDownWidth = ([System.Windows.Forms.TextRenderer]::MeasureText($Longest, `
                    $ResourceGroupDropDown.Font).Width, $ResourceGroupDropDown.Width | Measure-Object -Maximum).Maximum
            }

            foreach ($Item in $Locations)
            {
                $SuppressOutput = $LocationDropDown.Items.Add($Item)
            }

            if($Locations)
            {
                $Longest = ($Locations | sort Length -Descending)[0]
                $LocationDropDown.DropDownWidth = ([System.Windows.Forms.TextRenderer]::MeasureText($Longest, `
                    $LocationDropDown.Font).Width, $LocationDropDown.Width | Measure-Object -Maximum).Maximum
            }

            for ($Index = 4; $Index -lt $FormElementsList.Count; $Index++)
            {
                $FormElements[$FormElementsList[$Index]].Enabled = $false
            }

            $LoadingLabel.Text = ""
        }
    }

    ### <summary>
    ### Gets list of VMs for selected resource group and populates checklist.
    ### </summary>
    function Get-VirtualMachines
    {
        $ResourceGroupName = $this.SelectedItem.ToString()
        if ($ResourceGroupName)
        {
            $LoadingLabel.Text = ""
            $VmListBox = $FormElements["VmListBox"]
            $VmListBox.Items.Clear()
            $FormElements["VmLabel"].Enabled = $true
            $FormElements["LocationLabel"].Enabled = $true
            $VmListBox.Enabled = $true
            $LocationDropDown.Enabled = $true
            $LocationDropDown.Text = ""

            $VmList = (Get-AzureRmVm -ResourceGroupName $ResourceGroupName) | sort Name

            foreach ($Item in $VmList)
            {
                if ($Item.StorageProfile.OsDisk.EncryptionSettings.Enabled -eq "True")
                {
                    $SuppressOutput = $VmListBox.Items.Add($Item.Name)
                }
            }

            if($VmList -and ($VmListBox.Items.Count -gt 0))
            {
                $Longest = ($VmList.Name | sort Length -Descending)[0]
                $Size = [System.Windows.Forms.TextRenderer]::MeasureText($Longest, `
                    $VmListBox.Font).Width

                if ($Size -gt $VmListBox.Width)
                {
                    $VmListBox.Width = $Size + 30
                    $UserInputForm.Width = $Size + 60
                }
            }
            else
            {
                $LoadingLabel.Text = "Selected resource group does `nnot contain any encrypted VMs."
            }

            for ($Index = 8; $Index -lt $FormElementsList.Count; $Index++)
            {
                $FormElements[$FormElementsList[$Index]].Enabled = $false
            }
        }
    }

    ### <summary>
    ### Disable and clears remaining options when VM list modified.
    ### </summary>
    function Disable-RestOfOptions
    {
        $FormElements["LocationDropDown"].Text = ""
        $FormElements["BekDropDown"].Text = ""
        $FormElements["KekDropDown"].Text = ""

        for ($Index = 8; $Index -lt $FormElementsList.Count; $Index++)
        {
            if ($FormElements[$FormElementsList[$Index]].Text -ne 'Not Applicable')
            {
                $FormElements[$FormElementsList[$Index]].Enabled = $false
            }
        }
    }

    ### <summary>
    ### Gets list of target key vaults for KEK and BEK for selected VM(s) and populates dropdown.
    ### </summary>
    function Get-KeyVaults
    {
        $LocationName = $this.SelectedItem.ToString()

        if ($LocationName)
        {
            $BekDropDown = $FormElements["BekDropDown"]
            $KekDropDown = $FormElements["KekDropDown"]
            $ResourceGroupDropDown = $FormElements["ResourceGroupDropDown"]
            $VmSelected = $FormElements["VmListBox"].CheckedItems
            $FailCount = 0

            if ($VmSelected)
            {
                $LoadingLabel.Text = "Loading target BEK vault"
                $Bek = $Kek = ""
                $Index = 0

                while ((-not $Kek) -and ($Index -lt $VmSelected.Count))
                {
                    $Vm = Get-AzureRmVM -ResourceGroupName `
                    $ResourceGroupDropDown.SelectedItem.ToString() -Name $VmSelected[$Index]

                    if (-not $Bek)
                    {
                        $Bek = $Vm.StorageProfile.OsDisk.EncryptionSettings.DiskEncryptionKey
                    }

                    $Kek = $Vm.StorageProfile.OsDisk.EncryptionSettings.KeyEncryptionKey
                    $Index++
                }

                if (-not $Bek)
                {
                    $BekDropDown.Text = "Not Applicable"
                    $BekDropDown.Enabled = $false
                    $FailCount += 1
                }
                else
                {
                    $BekKeyVaultName = $Bek.SourceVault.Id.Split('/')[-1] + '-asr'
                    $BekKeyVault = Get-AzureRmResource -Name $BekKeyVaultName

                    if (-not $BekKeyVault)
                    {
                        $BekKeyVaultName = '(new)' + $BekKeyVaultName
                        $BekDropDown.Items.Add($BekKeyVaultName)
                    }

                    $BekDropDown.Text = $BekKeyVaultName
                }

                $LoadingLabel.Text = "Loading target KEK vault"

                if (-not $Kek)
                {
                    $KekDropDown.Text = "Not Applicable"
                    $KekDropDown.Enabled = $false
                    $FailCount += 1
                }
                else
                {
                    $KekKeyVaultName = $Kek.SourceVault.Id.Split('/')[-1] + '-asr'
                    $KekKeyVault = Get-AzureRmResource -Name $KekKeyVaultName

                    if (-not $KekKeyVault)
                    {
                        $KekKeyVaultName = '(new)' + $KekKeyVaultName
                        $KekDropDown.Items.Add($KekKeyVaultName)
                    }

                    $KekDropDown.Text = $KekKeyVaultName
                }

                if ($FailCount -lt 2)
                {
                    if ($BekDropDown.Items.Count -le 1)
                    {
                        $KeyVaultList = (Get-AzureRmKeyVault).VaultName | sort

                        foreach ($Item in $KeyVaultList)
                        {
                            $SuppressOutput = $BekDropDown.Items.Add($Item)
                            $SuppressOutput = $KekDropDown.Items.Add($Item)
                        }

                        if($KeyVaultList)
                        {
                            if($Bek)
                            {
                                $Longest = ($KeyVaultList + $BekKeyVaultName | sort Length -Descending)[0]
                                $BekDropDown.DropDownWidth = ([System.Windows.Forms.TextRenderer]::MeasureText($Longest, `
                                    $BekDropDown.Font).Width, $BekDropDown.Width | Measure-Object -Maximum).Maximum
                            }

                            if($Kek)
                            {
                                $Longest = ($KeyVaultList + $KekKeyVaultName  | sort Length -Descending)[0]
                                $KekDropDown.DropDownWidth = ([System.Windows.Forms.TextRenderer]::MeasureText($Longest, `
                                    $KekDropDown.Font).Width, $KekDropDown.Width | Measure-Object -Maximum).Maximum
                            }
                        }
                    }

                   for ($Index = 8; $Index -lt $FormElementsList.Count; $Index++)
                    {
                        if ($FormElements[$FormElementsList[$Index]].Text -ne 'Not Applicable')
                        {
                            $FormElements[$FormElementsList[$Index]].Enabled = $true
                        }
                    }
                }

                $LoadingLabel.Text = ""
            }
            else
            {
                $BekDropDown.Items.Clear()
                $KekDropDown.Items.Clear()
            }
        }
    }

    ### <summary>
    ### Gets list of all options selected on submission and closes the form.
    ### </summary>
    function Get-AllSelections
    {
        $UserInputs["ResourceGroupName"] = $FormElements["ResourceGroupDropDown"].SelectedItem.ToString()
        $UserInputs["VmNameArray"] = $FormElements["VmListBox"].CheckedItems
        $UserInputs["TargetLocation"] = $FormElements["LocationDropDown"].SelectedItem.ToString()
        $BekKeyVault = $FormElements["BekDropDown"].Text.Split(')')
        $UserInputs["TargetBekVault"] = $BekKeyVault[$BekKeyVault.Count - 1]
        $KekKeyVault = $FormElements["KekDropDown"].Text.Split(')')
        $UserInputs["TargetKekVault"] = $KekKeyVault[$KekKeyVault.Count - 1]
        $UserInputForm.Close()
    }

    ### <summary>
    ### Applies the formatting common to all UI objects.
    ### </summary>
    ### <param name="UiObject">UI object to be formatted.</param>
    ### <param name="Formattings">Custom formatting values.</param>
    function Add-CommonFormatting(
        $UiObject,
        [System.Collections.Hashtable] $Formattings)
    {
        $UiObject.Enabled = $false
        $UiObject.Font = 'Microsoft Sans Serif, 10'
        $UiObject.ForeColor = "#5c7290"
        $UiObject.width = $Formattings["width"]
        $UiObject.height = $Formattings["height"]
        $UiObject.location = New-Object System.Drawing.Point($Formattings["location"])
    }

    ### <summary>
    ### Generates the graphical user interface to get all inputs.
    ### </summary>
    function Generate-UserInterface
    {
        $UserInputForm = New-Object System.Windows.Forms.Form
        $SubscriptionLabel = New-Object System.Windows.Forms.Label
        $SubscriptionDropDown = New-Object System.Windows.Forms.ComboBox
        $ResourceGroupLabel = New-Object System.Windows.Forms.Label
        $ResourceGroupDropDown = New-Object System.Windows.Forms.ComboBox
        $VmLabel = New-Object System.Windows.Forms.Label
        $VmListBox = New-Object System.Windows.Forms.CheckedListBox
        $LocationLabel = New-Object System.Windows.Forms.Label
        $LocationDropDown = New-Object System.Windows.Forms.ComboBox
        $BekLabel = New-Object System.Windows.Forms.Label
        $BekDropDown = New-Object System.Windows.Forms.ComboBox
        $KekLabel = New-Object System.Windows.Forms.Label
        $KekDropDown = New-Object System.Windows.Forms.ComboBox
        $LoadingLabel = New-Object System.Windows.Forms.Label
        $SelectButton = New-Object System.Windows.Forms.Button
        $InfoToolTip = New-Object System.Windows.Forms.ToolTip

        $FormElementsList = @("SubscriptionLabel", "SubscriptionDropDown", "ResourceGroupLabel", `
            "ResourceGroupDropDown", "VmLabel", "VmListBox", "LocationLabel", "LocationDropDown", `
            "BekLabel", "BekDropDown", "KekLabel", "KekDropDown", "SelectButton")
        $FormElements = @{"SubscriptionLabel" = $SubscriptionLabel;` "SubscriptionDropDown" = `
            $SubscriptionDropDown; "ResourceGroupLabel" = $ResourceGroupLabel; "ResourceGroupDropDown" = `
            $ResourceGroupDropDown;` "VmLabel" = $VmLabel; "VmListBox" = $VmListBox; "LocationLabel" = `
            $LocationLabel; "LocationDropDown" = $LocationDropDown; "BekLabel" = $BekLabel; "BekDropDown" = `
            $BekDropDown; "KekLabel" = $KekLabel; "KekDropDown" = $KekDropDown; "SelectButton" = $SelectButton}

        # Applying formatting to various UI objects

        $UserInputForm.ClientSize = '445,620'
        $UserInputForm.text = "User Inputs"
        $UserInputForm.BackColor = "#ffffff"
        $UserInputForm.TopMost = $false

        $SubscriptionLabelFormatting = @{"location"=@(10, 90); "width"=88; "height"=30}
        Add-CommonFormatting -UiObject $SubscriptionLabel -Formattings $SubscriptionLabelFormatting
        $SubscriptionLabel.text = "Subscription"
        $SubscriptionLabel.AutoSize = $true
        $SubscriptionLabel.Enabled = $true
        $SubscriptionLabel.Tag = "Specify the Azure subscription ID."
        $SubscriptionLabel.Add_MouseHover({Show-Help})

        $SubscriptionDropDownFormatting = @{"location"=@(10, 121); "width"=424; "height"=66}
        Add-CommonFormatting -UiObject $SubscriptionDropDown -Formattings `
            $SubscriptionDropDownFormatting
        $SubscriptionDropDown.Enabled = $true
        $SubscriptionDropDown.DropDownHeight = 150
        $SubscriptionDropDown.AutoSize = $true
        $SubscriptionDropDown.Add_SelectedIndexChanged({Get-ResourceGroups})

        $ResourceGroupDropDownFormatting = @{"location"=@(10, 189); "width"=424; "height"=60}
        Add-CommonFormatting -UiObject $ResourceGroupDropDown -Formattings `
            $ResourceGroupDropDownFormatting
        $ResourceGroupDropDown.DropDownHeight = 150
        $ResourceGroupDropDown.Add_SelectedIndexChanged({Get-VirtualMachines})

        $ResourceGroupLabelFormatting = @{"location"=@(10, 163); "width"=25; "height"=10}
        Add-CommonFormatting -UiObject $ResourceGroupLabel -Formattings $ResourceGroupLabelFormatting
        $ResourceGroupLabel.text = "Resource Group"
        $ResourceGroupLabel.AutoSize = $true
        $ResourceGroupLabel.Tag = "Specify the source resource group containing the virtual machines."
        $ResourceGroupLabel.Add_MouseHover({Show-Help})

        $VmListBoxFormatting = @{"location"=@(10, 255); "width"=424; "height"=95}
        Add-CommonFormatting -UiObject $VmListBox -Formattings $VmListBoxFormatting
        $VmListBox.CheckOnClick = $true
        $VmListBox.Add_SelectedIndexChanged({Disable-RestOfOptions})

        $VmLabelFormatting = @{"location"=@(10, 233); "width"=25; "height"=10}
        Add-CommonFormatting -UiObject $VmLabel -Formattings $VmLabelFormatting
        $VmLabel.text = "Choose virtual machine(s)"
        $VmLabel.AutoSize = $true
        $VmLabel.Tag = "Select the virtual machines whose Disk Encryption Keys need to be copied to DR location."
        $VmLabel.Add_MouseHover({Show-Help})

        $BekDropDownFormatting = @{"location"=@(10, 445); "width"=424; "height"=30}
        Add-CommonFormatting -UiObject $BekDropDown -Formattings $BekDropDownFormatting
        $BekDropDown.DropDownHeight = 150

        $BekLabelFormatting = @{"location"=@(10, 420); "width"=25; "height"=10}
        Add-CommonFormatting -UiObject $BekLabel -Formattings $BekLabelFormatting
        $BekLabel.text = "Target Disk Encryption Key vault"
        $BekLabel.AutoSize = $true
        $BekLabel.Tag = "Specify the target disk encryption key vault in DR region where the keys will be copied to."
        $BekLabel.Add_MouseHover({Show-Help})

        $KekDropDownFormatting = @{"location"=@(10, 506); "width"=424; "height"=30}
        Add-CommonFormatting -UiObject $KekDropDown -Formattings $KekDropDownFormatting
        $KekDropDown.DropDownHeight = 150

        $KekLabelFormatting = @{"location"=@(10, 480); "width"=25; "height"=10}
        Add-CommonFormatting -UiObject $KekLabel -Formattings $KekLabelFormatting
        $KekLabel.text = "Target Key Encryption Key vault"
        $KekLabel.AutoSize = $true
        $KekLabel.Tag = "Specify the target key encryption key vault in DR region where the keys will be copied to."
        $KekLabel.Add_MouseHover({Show-Help})

        $LocationDropDownFormatting = @{"location"=@(10, 386); "width"=424; "height"=20}
        Add-CommonFormatting -UiObject $LocationDropDown -Formattings $LocationDropDownFormatting
        $LocationDropDown.DropDownHeight = 150
        $LocationDropDown.Add_SelectedIndexChanged({Get-KeyVaults})

        $LocationLabelFormatting = @{"location"=@(10, 360); "width"=25; "height"=10}
        Add-CommonFormatting -UiObject $LocationLabel -Formattings $LocationLabelFormatting
        $LocationLabel.text = "Target Location"
        $LocationLabel.AutoSize = $true
        $LocationLabel.Tag = "Select the Disaster Recovery (DR) location."
        $LocationLabel.Add_MouseHover({Show-Help})

        $LoadingLabelFormatting = @{"location"=@(150, 535); "width"=25; "height"=10}
        Add-CommonFormatting -UiObject $LoadingLabel -Formattings $LoadingLabelFormatting
        $LoadingLabel.text = ""
        $LoadingLabel.AutoSize = $true
        $LoadingLabel.Enabled = $true
        $LoadingLabel.Add_MouseHover({Show-Help})

        $SelectButtonFormatting = @{"location"=@(184, 580); "width"=75; "height"=30}
        Add-CommonFormatting -UiObject $SelectButton -Formattings $SelectButtonFormatting
        $SelectButton.BackColor = "#eeeeee"
        $SelectButton.text = "Select"
        $SelectButton.Add_Click({Get-AllSelections})

        $MsLogo = New-Object System.Windows.Forms.PictureBox
        $MsLogo.width = 140
        $MsLogo.height = 80
        $MsLogo.location = New-Object System.Drawing.Point(150, 10)
        $MsLogo.imageLocation = "https://c.s-microsoft.com/en-us/CMSImages/ImgOne.jpg?version=D418E733-821C-244F-37F9-DC865BDEFEC0"
        $MsLogo.SizeMode = [System.Windows.Forms.PictureBoxSizeMode]::zoom

        # Populating the subscription dropdown and launching the form

        [array]$SubscriptionArray = ((Get-AzureRmSubscription).Name | sort)

        foreach ($Item in $SubscriptionArray)
        {
            $SuppressOutput = $SubscriptionDropDown.Items.Add($Item)
        }

        $Longest = ($SubscriptionArray | sort Length -Descending)[0]
        $SubscriptionDropDown.DropDownWidth = ([System.Windows.Forms.TextRenderer]::MeasureText($Longest, `
            $SubscriptionDropDown.Font).Width, $SubscriptionDropDown.Width | Measure-Object -Maximum).Maximum

        $UserInputForm.controls.AddRange($FormElements.Values + $LoadingLabel)
        $UserInputForm.controls.AddRange($MsLogo)
        [void]$UserInputForm.ShowDialog()
    }

    ### <summary>
    ### Gets the access token to key vaults.
    ### </summary>
    function Get-AccessToken
    {
        # Vault resources endpoint
        $ArmResource = "https://vault.azure.net"
        # Well known client ID for AzurePowerShell used to authenticate scripts to Azure AD.
        $ClientId = "1950a258-227b-4e31-a9cf-717495945fc2"
        $RedirectUri = "urn:ietf:wg:oauth:2.0:oob"
        $AuthorityUri = "https://login.windows.net/$TenantId"
        $AuthContext = New-Object "Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext" `
            -ArgumentList $AuthorityUri
        $AuthResult = $AuthContext.AcquireToken($ArmResource, $ClientId, $RedirectUri, "Auto")
        return $AuthResult.AccessToken
    }

    ### <summary>
    ### Encrypts the secret based on the key provided.
    ### </summary>
    ### <param name="DecryptedValue">Decrypted secret value.</param>
    ### <param name="EncryptedAlgorithm">Name of the encryption algorithm used.</param>
    ### <param name="AccessToken">Access token for the key vault.</param>
    ### <param name="KeyId">Id of the key to be used for encryption.</param>
    function Encrypt-Secret(
        $DecryptedValue,
        [string]$EncryptedAlgorithm,
        [string]$AccessToken,
        [string]$KeyId)
    {
        $Body = @{
            'value' = $DecryptedValue
            'alg'   = $EncryptedAlgorithm}

        $BodyJson = ConvertTo-Json -InputObject $Body

        $Params = @{
            ContentType = 'application/json'
            Headers     = @{
                'authorization' = "Bearer $AccessToken"}
            Method      = 'POST'
            URI         = "$KeyId" + '/encrypt?api-version=2016-10-01'
            Body        = $BodyJson}

        try
        {
            $Response = Invoke-RestMethod @Params
        }
        catch
        {
            $ErrorString = "You do not have sufficient permissions to encrypt. " + `
                'You need "ENCRYPT" permissions for key vault keys'
            throw [System.UnauthorizedAccessException] $ErrorString
        }
        finally
        {
            Write-Verbose "`nEncrypt request: `n$(ConvertTo-Json -InputObject $Params)"
            Write-Verbose "`nEncrypt resonse: `n$(ConvertTo-Json -InputObject $Response)"
        }

        return $Response
    }

    ### <summary>
    ### Decrypts the secret based on the key provided.
    ### </summary>
    ### <param name="EncryptedValue">Encrypted secret value.</param>
    ### <param name="EncryptedAlgorithm">Name of the encryption algorithm used.</param>
    ### <param name="AccessToken">Access token for the key vault.</param>
    ### <param name="KeyId">Id of the key to be used for decryption.</param>
    function Decrypt-Secret(
        $EncryptedValue,
        [string]$EncryptedAlgorithm,
        [string]$AccessToken,
        [string]$KeyId)
    {
        $Body = @{
            'value' = $EncryptedValue
            'alg'   = $EncryptedAlgorithm}

        $BodyJson = ConvertTo-Json -InputObject $Body

        $Params = @{
            ContentType = 'application/json'
            Headers     = @{
                'authorization' = "Bearer $AccessToken"}
            Method      = 'POST'
            URI         = "$KeyId" + '/decrypt?api-version=2016-10-01'
            Body        = $BodyJson}

        try
        {
            $Response = Invoke-RestMethod @Params
        }
        catch
        {
            $ErrorString = "You do not have sufficient permissions to decrypt. " + `
                'You need "DECRYPT" permissions for key vault keys'
            throw [System.UnauthorizedAccessException] $ErrorString
        }
        finally
        {
            Write-Verbose "`nDecrypt request: `n$(ConvertTo-Json -InputObject $Params)"
            Write-Verbose "`nDecrypt resonse: `n$(ConvertTo-Json -InputObject $Response)"
        }

        return $Response
    }

    ### <summary>
    ### Copies all access policies from source to newly created target key vault.
    ### </summary>
    ### <param name="TargetKeyVaultName">Name of the target key vault.</param>
    ### <param name="TargetResourceGroupName">Name of the target resource group.</param>
    ### <param name="SourceKeyVaultName">Name of the source key vault.</param>
    ### <param name="SourceAccessPolicies">List of the source access policies to be copied.</param>
    function Copy-AccessPolicies(
        [string]$TargetKeyVaultName,
        [string]$TargetResourceGroupName,
        [string]$SourceKeyVaultName,
        $SourceAccessPolicies)
    {
        $Index = 0

        foreach ($AccessPolicy in $SourceAccessPolicies)
        {
            $SetPolicyCommand = "Set-AzureRmKeyVaultAccessPolicy -VaultName $TargetKeyVaultName" + `
            " -ResourceGroupName $TargetResourceGroupName -ObjectId $($AccessPolicy.ObjectId)" + ' '

            if ($AccessPolicy.Permissions.Keys)
            {
                $AddKeys = " -PermissionsToKeys $($AccessPolicy.Permissions.Keys -join ',')"
                $SetPolicyCommand += $AddKeys
            }

            if ($AccessPolicy.Permissions.Secrets)
            {
                $AddSecrets = " -PermissionsToSecrets $($AccessPolicy.Permissions.Secrets -join ',')"
                $SetPolicyCommand += $AddSecrets
            }

            if ($AccessPolicy.Permissions.Certificates)
            {
                $AddCertificates = " -PermissionsToCertificates $($AccessPolicy.Permissions.Certificates -join ',')"
                $SetPolicyCommand += $AddCertificates
            }

            if ($AccessPolicy.Permissions.Storage)
            {
                $AddStorage = " -PermissionsToStorage $($AccessPolicy.Permissions.Storage -join ',')"
                $SetPolicyCommand += $AddStorage
            }

            Invoke-Expression -Command $SetPolicyCommand
            $Index++
            Write-Progress -Activity "Copying access policies from $SourceKeyVaultName to $TargetKeyVaultName" `
                -Status "Access Policy $Index of $($SourceAccessPolicies.Count)" `
                -PercentComplete ($Index / $SourceAccessPolicies.Count * 100)
        }
    }

    ### <summary>
    ### Compares the key vault permissions with minimum required.
    ### </summary>
    ### <param name="ResourceObject"Switch to check if access policies list obtained from resource object.</param>
    ### <param name="KeyVaultName">Name of the key vault which is to be checked.</param>
    ### <param name="PermissionsRequired">List of minimum permissions required.</param>
    ### <param name="AccessPolicies">List of the key vault's access policies.</param>
    function Compare-Permissions(
        [switch] $ResourceObject,
        [string] $KeyVaultName,
        [string[]] $PermissionsRequired,
        $AccessPolicies)
    {
        $ErrorString1 = "You do not have sufficient permissions to access "
        $ErrorString2 = " in the key vault $KeyVaultName. You need $($PermissionsRequired -join ',') for key vault "
        $PermissionsType = 'keys'
        foreach ($Policy in $AccessPolicies)
        {
            if ($Policy.ObjectId -eq $UserId)
            {
                if($ResourceObject)
                {
                    $Permissions = $Policy.Permissions.Keys

                    if($Secret)
                    {
                        $Permissions = $Policy.Permissions.Secrets
                        $PermissionsType = "secrets"
                    }

                    $Permissions = $Permissions | %{$_.ToLower()}

                    if (($PermissionsRequired | % { $Permissions.Contains($_)}) -contains $false)
                    {
                        $ErrorString = $ErrorString1 + $PermissionsType + $ErrorString2
                        $ErrorString += $PermissionsType
                        throw [System.UnauthorizedAccessException] $ErrorString
                    }
                }
                else
                {
                    $Permissions = $Policy.PermissionsToKeys

                    if($Secret)
                    {
                        $Permissions = $Policy.PermissionsToSecrets
                        $PermissionsType = "secrets"
                    }

                    $Permissions = $Permissions | %{$_.ToLower()}

                    if (($PermissionsRequired | % { $Permissions.Contains($_)}) -contains $false)
                    {
                        $ErrorString = $ErrorString1 + $PermissionsType + $ErrorString2
                        $ErrorString += $PermissionsType + '.'
                        throw [System.UnauthorizedAccessException] $ErrorString
                    }
                }

                break
            }
        }
    }

    ### <summary>
    ### Conducts few prerequisite steps checking permissions and existence of key vaults.
    ### </summary>
    ### <param name="Secret">Whether the prerequisite check is happening for secrets.</param>
    ### <param name="EncryptionKey">Disk or key encryption key whose key vault needs to be checked.</param>
    ### <param name="TargetKeyVaultName">Name of the target key vault.</param>
    ### <param name="SourcePermissions">Minimum permissions required for keys and secrets in source key vault.</param>
    ### <param name="TargetPermissions">Minimum permissions required for keys and secrets in target key vault.</param>
    ### <param name="IsKeyVaultNew">Bool reference to whether a new target vault is created or not.</param>
    ### <return name="KeyVaultResource">Source key vault object associated with the encryption key</return>
    function Conduct-KeyVaultPreReq(
        [switch] $Secret,
        $EncryptionKey,
        $TargetKeyVaultName,
        $SourcePermissions,
        $TargetPermissions,
        [ref]$IsKeyVaultNew)
    {
        $KeyVaultResource = Get-AzureRmResource -ResourceId $EncryptionKey.SourceVault.Id

        # Checking whether user has required permissions to the Source Key vault
        Compare-Permissions -KeyVaultName $KeyVaultResource.Name -PermissionsRequired $SourcePermissions `
            -AccessPolicies $KeyVaultResource.Properties.AccessPolicies -ResourceObject

        try
        {
            $TargetKeyVault = Get-AzureRmKeyVault -VaultName $TargetKeyVaultName
        }
        catch
        {
            # Target key vault does not exist
            $TargetKeyVault = $null
        }

        if (-not $TargetKeyVault)
        {
            $IsKeyVaultNew.Value = $true
            Write-Host "Creating key vault $TargetKeyVaultName" -ForegroundColor Green
            $TargetResourceGroupName = "$($KeyVaultResource.ResourceGroupName)" + "-asr"

            try
            {
                $TargetResourceGroup = Get-AzureRmResourceGroup -Name $TargetResourceGroupName
            }
            catch
            {
                # Target resource group does not exist
                $TargetResourceGroup = $null
            }

            if (-not $TargetResourceGroup)
            {
                New-AzureRmResourceGroup -Name $TargetResourceGroupName -Location $TargetLocation
            }

            $SuppressOutput = New-AzureRmKeyVault -VaultName $TargetKeyVaultName -ResourceGroupName `
                $TargetResourceGroupName -Location $TargetLocation `
                -EnabledForDeployment:$KeyVaultResource.Properties.EnabledForDeployment `
                -EnabledForTemplateDeployment:$KeyVaultResource.Properties.EnabledForTemplateDeployment `
                -EnabledForDiskEncryption:$KeyVaultResource.Properties.EnabledForDiskEncryption `
                -EnableSoftDelete:$KeyVaultResource.Properties.EnableSoftDelete -Sku $KeyVaultResource.Properties.Sku.name `
                -Tag $KeyVaultResource.Tags
        }
        else
        {
            # Check only when existing BEK key vault or existing KEK key vault different from secret key vault.
            if($Secret -or (-not $IsBekKeyVaultNew) -or ($TargetBekVault -ne $TargetKeyVaultName))
            {
                # Checking whether user has required permissions to the Target Key vault
                Compare-Permissions -KeyVaultName $TargetKeyVault.VaultName-PermissionsRequired $TargetPermissions `
                -AccessPolicies $TargetKeyVault.AccessPolicies
            }
        }

        return $KeyVaultResource
    }

    ### <summary>
    ### Create a secret in the target key vault.
    ### </summary>
    ### <param name="Secret">Value of the secret text.</param>
    ### <param name="ContentType">Type of secret to be created - Wrapped BEK or BEK.</param>
    function Create-Secret(
        $Secret,
        [string]$ContentType)
    {
        Write-Host 'Copying "Disk Encryption Key" for' "$VmName" -ForegroundColor Green
        $SecureSecret = ConvertTo-SecureString $Secret -AsPlainText -Force
        $SuppressOutput = Set-AzureKeyVaultSecret -VaultName $TargetBekVault -Name $BekSecret.Name -SecretValue `
            $SecureSecret -tags $BekTags -ContentType $ContentType
    }

    ### <summary>
    ### Main flow of code for copying keys.
    ### </summary>
    ### <return name="CompletedList">List of VMs for which CopyKeys ran successfully</return>
    function Start-CopyKeys
    {
        $SuppressOutput = Login-AzureRmAccount -ErrorAction Stop

        $CompletedList = @()
        $UserInputs = New-Object System.Collections.Hashtable
        Write-Verbose "Starting user interface to get inputs"
        Generate-UserInterface

        $ResourceGroupName = $UserInputs["ResourceGroupName"]
        $VmNameArray = $UserInputs["VmNameArray"]
        $TargetLocation = $UserInputs["TargetLocation"]
        $TargetBekVault = $UserInputs["TargetBekVault"]
        $TargetKekVault = $UserInputs["TargetKekVault"]

        $Context = Get-AzureRmContext

        Write-Verbose "`nSubscription Id: $($Context.Subscription.Id)"
        Write-Verbose "Inputs:`n$(ConvertTo-Json -InputObject $UserInputs)"

        $TenantId = $Context.Tenant.Id
        $UserPrincipalName = $Context.Account.Id
        $UserId = (Get-AzureRmADUser -UserPrincipalName $UserPrincipalName).Id

        foreach($VmName in $VmNameArray)
        {
            $IsBekKeyVaultNew = $false
            $IsKekKeyVaultNew = $false

            try
            {
                $Vm = Get-AzureRmVM -Name $VmName -ResourceGroupName $ResourceGroupName

                $Bek = $Vm.StorageProfile.OsDisk.EncryptionSettings.DiskEncryptionKey
                $Kek = $Vm.StorageProfile.OsDisk.EncryptionSettings.KeyEncryptionKey

                if (-not $Bek)
                {
                    throw [System.MissingFieldException] "Virtual machine $VmName encrypted but disk encryption key " + `
                        "details missing."
                }

                $BekKeyVaultResource = Conduct-KeyVaultPreReq -EncryptionKey $Bek -TargetKeyVaultName $TargetBekVault `
                    -IsKeyVaultNew ([ref]$IsBekKeyVaultNew) -SourcePermissions $SourceSecretsPermissions `
                    -TargetPermissions $TargetSecretsPermissions -Secret

                # Getting the BEK secret value text.
                [uri]$Url = $Bek.SecretUrl
                $BekSecret = Get-AzureKeyVaultSecret -VaultName $BekKeyVaultResource.Name -Version $Url.Segments[3] `
                    -Name $Url.Segments[2].TrimEnd("/")
                $BekSecretBase64 = $BekSecret.SecretValueText
                $BekTags = $BekSecret.Attributes.Tags

                if ($Kek)
                {
                    $BekEncryptionAlgorithm = $BekSecret.Attributes.Tags.DiskEncryptionKeyEncryptionAlgorithm
                    $AccessToken = Get-AccessToken
                    $KekKeyVaultResource = Conduct-KeyVaultPreReq -EncryptionKey $Kek -TargetKeyVaultName $TargetKekVault `
                        -IsKeyVaultNew ([ref]$IsKekKeyVaultNew) -SourcePermissions $SourceKeysPermissions `
                        -TargetPermissions $TargetKeysPermissions

                    # Creating the new KEK
                    [uri]$Url = $Kek.KeyUrl
                    $KekKey = Get-AzureKeyVaultKey -VaultName $KekKeyVaultResource.Name -Version $Url.Segments[3] `
                        -Name $Url.Segments[2].TrimEnd("/")
                    $NewKekKey = Add-AzureKeyVaultKey -VaultName $TargetKekVault -Name $KekKey.Name -Destination Software

                    if ($IsKekKeyVaultNew -or ($IsBekKeyVaultNew -and ($TargetBekVault -eq $TargetKekVault)))
                    {
                        # In case of new target key vault, initially an encrypt permission is given which is then updated
                        # with all actual permissions during Copy-AccessPolicies
                        Set-AzureRmKeyVaultAccessPolicy -VaultName $TargetKekVault -UserPrincipalName $UserPrincipalName `
                            -PermissionsToKeys 'Encrypt'
                    }

                    Write-Host 'Copying "Key Encryption Key" for' "$VmName" -ForegroundColor Green

                    $TargetKekUri = "https://" + "$TargetKekVault" + ".vault.azure.net/keys/" + $NewKekKey.Name + '/' + `
                        $NewKekKey.Version

                    # Decrypting Wrapped-BEK
                    $DecryptedSecret = Decrypt-Secret -EncryptedValue $BekSecretBase64 -EncryptedAlgorithm `
                        $BekEncryptionAlgorithm -AccessToken $AccessToken -KeyId $Kekkey.Key.Kid

                    # Encrypting BEK with new KEK
                    $EncryptedSecret = Encrypt-Secret -DecryptedValue $DecryptedSecret.value -EncryptedAlgorithm `
                        $BekEncryptionAlgorithm -AccessToken $AccessToken -KeyId $TargetKekUri

                    $BekTags.DiskEncryptionKeyEncryptionKeyURL = $TargetKekUri
                    Create-Secret -Secret $EncryptedSecret.value -ContentType "Wrapped BEK"

                    if ($IsKekKeyVaultNew)
                    {
                        # Copying access policies to new KEK target key vault
                        $TargetKekRgName = "$($KekKeyVaultResource.ResourceGroupName)" + "-asr"
                        Copy-AccessPolicies -TargetKeyVaultName $TargetKekVault -TargetResourceGroupName $TargetKekRgName `
                            -SourceKeyVaultName $KekKeyVaultResource.Name -SourceAccessPolicies `
                            $KekKeyVaultResource.Properties.AccessPolicies
                    }
                }
                else
                {
                    Create-Secret -Secret $BekSecretBase64 -ContentType "BEK"
                }

                if ($IsBekKeyVaultNew)
                {
                    # Copying access policies to new BEK target key vault
                    $TargetBekRgName = "$($BekKeyVaultResource.ResourceGroupName)" + "-asr"
                    Copy-AccessPolicies -TargetKeyVaultName $TargetBekVault -TargetResourceGroupName $TargetBekRgName `
                        -SourceKeyVaultName $BekKeyVaultResource.Name -SourceAccessPolicies `
                        $BekKeyVaultResource.Properties.AccessPolicies
                }

                $CompletedList += $VmName
            }
            catch
            {
                Write-Warning "`nCopyKeys not completed for $VmName"
                $IncompleteList[$VmName] = $_
            }
        }

        return $CompletedList
    }

    $ErrorActionPreference = "Stop"
    $SourceSecretsPermissions = @('get')
    $TargetSecretsPermissions = @('set')
    $SourceKeysPermissions = @('get', 'decrypt')
    $TargetKeysPermissions = @('create', 'encrypt')

    try
    {
        Write-Verbose "$(Get-Date -Format 'dd/mm/yyyy HH:mm:ss:fff') - CopyKeys started"
        $CompletedList = @()
        $IncompleteList = New-Object System.Collections.Hashtable
        $CompletedList = Start-CopyKeys
    }
    catch
    {
        Write-Host -ForegroundColor Red -BackgroundColor Black ("`nException: " + $PSItem.Exception.Message)
        Write-Host -ForegroundColor Red -BackgroundColor Black ("At: " + $PSItem.InvocationInfo.Line.Trim())
        Write-Host -ForegroundColor Red -BackgroundColor Black ("Line: " + $PSItem.InvocationInfo.ScriptLineNumber + `
            "; Char:" + $PSItem.InvocationInfo.OffsetInLine + "`n" + "StackTrace: `n" + $PSItem.ScriptStackTrace)
        Write-Host -ForegroundColor Red -BackgroundColor Black ("CategoryInfo: " + $PSItem.CategoryInfo.Category + ": " + `
            $PSItem.CategoryInfo.Activity + ", " + $PSItem.CategoryInfo.Reason)
        Write-Host -ForegroundColor Red -BackgroundColor Black ("An unknown exception occurred. Please contact " + `
            "support with the error details")
    }
    finally
    {
        # Summarizes the CopyKeys status for various Vms
        if($CompletedList.Count -gt 0)
        {
            Write-Host -ForegroundColor Green "`nCopyKeys succeeded for VMs - $($CompletedList -join ', ')."
        }
        $IncompleteList.Keys | % {
            Write-Host -ForegroundColor Green "`nCopyKeys failed for $_ with"
            Write-Host -ForegroundColor Red -BackgroundColor Black ("Exception: " + $IncompleteList[$_].Exception.Message)
            Write-Host -ForegroundColor Red -BackgroundColor Black ("At: " + $IncompleteList[$_].InvocationInfo.Line.Trim())
            Write-Host -ForegroundColor Red -BackgroundColor Black ("Line: " + `
                $IncompleteList[$_].InvocationInfo.ScriptLineNumber + "; Char:" + `
                $IncompleteList[$_].InvocationInfo.OffsetInLine + "`n" + "StackTrace: `n" + `
                $IncompleteList[$_].ScriptStackTrace)
            Write-Host -ForegroundColor Red -BackgroundColor Black ("CategoryInfo: " + `
                $IncompleteList[$_].CategoryInfo.Category + ": " + $IncompleteList[$_].CategoryInfo.Activity + ", " + `
                $IncompleteList[$_].CategoryInfo.Reason)
        }
        Write-Verbose "$(Get-Date -Format 'dd/mm/yyyy HH:mm:ss:fff') - CopyKeys completed"
    }
    ```
2. Open the Windows PowerShell application and go to the folder where the file exists.
3. Launch 'Copy-keys.ps1'
## Enable replication

Enable replication. This procedure assumes that the primary Azure region is East Asia, and the secondary region is South East Asia.

1. In the vault, click **+Replicate**.
2. Note the following fields:
    - **Source**: The point of origin of the VMs, which in this case is **Azure**.
    - **Source location**: The Azure region from where you want to protect your virtual machines. For this illustration, the source location is 'East Asia'
    - **Deployment model**: Azure deployment model of the source machines.
    - **Source subscription**: The subscription to which your source virtual machines belong. This can be any subscription within the same Azure Active Directory tenant where your recovery services vault exists.
    - **Resource Group**: The resource group to which your source virtual machines belong. All the VMs under the selected resource group are listed for protection in the next step.

    ![Enable replication](./media/site-recovery-replicate-azure-to-azure/enabledrwizard1.png)

3. In **Virtual Machines > Select virtual machines**, click and select each VM that you want to replicate. You can only select machines for which replication can be enabled. Then, click **OK**.
   	![Enable replication](./media/site-recovery-replicate-azure-to-azure/virtualmachine_selection.png)

4. In **Settings**, you can optionally configure target site settings:

    - **Target Location**: The location where your source virtual machine data will be replicated. Depending upon your selected machines location, Site Recovery will provide you the list of suitable target regions. We recommend that you keep the target location the same as the Recovery Services vault location.
    - **Target subscription**: The target subscription used for disaster recovery. By default, the target subscription will be same as the source subscription.
    - **Target resource group**: The resource group to which all your replicated virtual machines belong. By default Azure Site Recovery creates a new resource group in the target region with name having "asr" suffix. In case resource group created by Azure Site Recovery already exists, it is reused. You can also choose to customize it as shown in the section below. The location of the target resource group can be any Azure region except the region in which the source virtual machines are hosted.
    - **Target Virtual Network**: By default, Site Recovery creates a new virtual network in the target region with name having "asr" suffix. This is mapped to your source network, and used for any future protection. [Learn more](site-recovery-network-mapping-azure-to-azure.md) about network mapping.
    - **Target Storage accounts (If your source VM does not use managed disks)**: By default, Site Recovery creates a new target storage account mimicking your source VM storage configuration. In case storage account already exists, it is reused.
    - **Replica managed disks (If your source VM uses managed disks)**: Site Recovery creates new replica managed disks in the target region to mirror the source VM's managed disks with the same storage type (Standard or premium) as the source VM's managed disk.
    - **Cache Storage accounts**: Site Recovery needs extra storage account called cache storage in the source region. All the changes happening on the source VMs are tracked and sent to cache storage account before replicating those to the target location.
    - **Availability set**: By default, Azure Site Recovery creates a new availability set in the target region with name having "asr" suffix. In case availability set created by Azure Site Recovery already exists, it is reused.
    - **Disk encryption key vault**:
    - **Replication Policy**: It defines the settings for recovery point retention history and app consistent snapshot frequency. By default, Azure Site Recovery creates a new replication policy with default settings of ‘24 hours’ for recovery point retention and ’60 minutes’ for app consistent snapshot frequency.

	![Enable replication](./media/site-recovery-replicate-azure-to-azure/enabledrwizard3.PNG)

## Copy Azure disk encryption keys using PowerShell Script

## Customize target resources

You can modify the default target settings used by Site Recovery.


1. Click **Customize:** next to 'Target subscription' to modify the default target subscription. Select the subscription from the list of all the subscriptions available in the same Azure Active Directory (AAD) tenant.

2. Click **Customize:** to modify default settings:
	- In **Target resource group**, select the resource group from the list of all the resource groups in the target location of the subscription.
	- In **Target virtual network**, select the network from a list of all the virtual network in the target location.
	- In **Availability set**, you can add availability set settings to the VM, if they're part of an availability set in the source region.
	- In **Target Storage accounts**, select the account you want to use.

		![Enable replication](./media/site-recovery-replicate-azure-to-azure/customize.PNG)

2. Click **Create target resource** > **Enable Replication**.
3. After the VMs are enabled for replication, you can check the status of VM health under **Replicated items**

>[!NOTE]
>During initial replication the status might take some time to refresh, without progress. Click the **Refresh** button, to get the latest status.
>

# Next steps

[Learn more](site-recovery-test-failover-to-azure.md) about running a test failover.
