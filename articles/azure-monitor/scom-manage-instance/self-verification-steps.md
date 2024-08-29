---
ms.assetid: 
title: Azure Monitor SCOM Managed Instance self-verification of steps
description: This article describes the self-verification processes of the Operations Manager admin, Active Directory admin, and network admin.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Azure Monitor SCOM Managed Instance self-verification of steps

This article describes the self-verification processes of the Operations Manager admin, Active Directory admin, and network admin.

> [!NOTE]
> To learn about the Azure Monitor SCOM Managed Instance architecture, see [Azure Monitor SCOM Managed Instance](overview.md).

After you set up the required parameters, run the self-validation tool. Based on the experience and data collected from telemetry, Operations Manager administrators have spent considerable time validating the accuracy of parameters. Running this tool helps to identify any issues with your environment or parameters before you proceed with the deployment.

Many customers benefit from this tool because it saves time that would otherwise be spent troubleshooting issues with parameters later on. We recommend running this tool before deployment to avoid spending excessive time diagnosing and troubleshooting on-premises parameters in the future.

In the process of creating an instance of SCOM Managed Instance, three primary personas are involved. The following flow is typical of how the Operations Manager admin sets up the steps in enterprise organizations:

1. The Operations Manager admin initiates communication with the Active Directory admin to configure all the Active Directory-related settings.

1. The Operations Manager admin then communicates with the network admin to establish the virtual network and configure the necessary firewalls, network security groups, and DNS resolution to connect to the designated Active Directory controller, as outlined in the network prerequisites.

1. After all the configurations are implemented, the Operations Manager admin proceeds with thorough testing on a test virtual machine (VM) to ensure that everything functions as expected. This testing phase helps to proactively identify and address any potential issues.

If the Operations Manager admin plays all three roles, they can independently handle and manage all the tasks without requiring the involvement of different personnel for each specific area.

With the steps provided for each persona to validate the parameters, we aim to streamline the process of setting up the parameters to reduce the time required for creating the SCOM managed instance.

By empowering each persona to verify their respective parameters, we can expedite the overall setup process and achieve faster SCOM managed instance deployment.

## Operations Manager admin self-verification of steps

Running Operations Manager admin self-verification is essential to understand the accuracy of the parameters.

> [!VIDEO de6cac42-06ca-4517-bb99-9438ce2b8fa5]

> [!IMPORTANT]
> Initially, create a new test Windows Server (2022/2019) VM in the same subnet selected for the SCOM managed instance creation. Subsequently, both your Active Directory admin and network admin can individually use this VM to verify the effectiveness of their respective changes. This approach saves time spent on back-and-forth communication between the Active Directory admin and the network admin.

Follow these steps to run the validation script:

1. Generate a new VM running on Windows Server 2022 or 2019 within the chosen subnet for the SCOM managed instance creation. Sign in to the VM and configure its DNS server to use the same DNS server IP that you plan to use during the creation of the SCOM managed instance. For example, see the following screenshot to set the DNS server IP.

     :::image type="DNS server IP" source="media/scom-managed-instance-self-verification-of-steps/dns-server-ip.png" alt-text="Screenshot that shows the DNS server IP.":::

1. [Download the validation script](https://download.microsoft.com/download/2/3/a/23a14c00-8adf-4aba-99ea-6c80fb321f3b/SCOMMI%20Validation%20and%20Troubleshooter.zip) to the test VM and extract. It consists of five files:
     - `Readme.txt`
     - `ScomValidation.ps1`
     - `RunValidationAsSCOMAdmin.ps1`
     - `RunValidationAsActiveDirectoryAdmin.ps1`
     - `RunValidationAsNetworkAdmin.ps1`

1. Follow the steps mentioned in the `Readme.txt` file to run `RunValidationAsSCOMAdmin.ps1`. Make sure to fill in the settings value in `RunValidationAsSCOMAdmin.ps1` with applicable values before you run it.

   ```powershell
   # $settings = @{
   #   Configuration = @{
   #         DomainName="test.com"                 
   #         OuPath= "DC=test,DC=com"           
   #         DNSServerIP = "000.00.0.00"           
   #         UserName="test\testuser"              
   #         Password = "password"                 
   #         SqlDatabaseInstance= "test-sqlmi-instance.023a29518976.database.windows.net" 
   #         ManagementServerGroupName= "ComputerMSG"      
   #         GmsaAccount= "test\testgMSA$"
   #         DnsName= "lbdsnname.test.com"
   #         LoadBalancerIP = "00.00.00.000"
   #     }
   # }
   # Note : Before running this script, please make sure you have provided all the parameters in the settings
   $settings = @{
   Configuration = @{
   DomainName="<domain name>"
   OuPath= "<OU path>"
   DNSServerIP = "<DNS server IP>"
   UserName="<domain user name>"
   Password = "<domain user password>"
   SqlDatabaseInstance= "<SQL MI Host name>"
   ManagementServerGroupName= "<Computer Management server group name>"
   GmsaAccount= "<GMSA account>"
   DnsName= "<DNS name associated with the load balancer IP address>"
   LoadBalancerIP = "<Load balancer IP address>"
   }
   }
   ```

1. In general, `RunValidationAsSCOMAdmin.ps1` runs all the validations. If you want to run a specific check, open `ScomValidation.ps1` and comment all other checks, which are at the end of the file. You can also add a breakpoint in the specific check to debug the check and understand the issues better.

   ```powershell
	    # Default mode is - SCOMAdmin, by default if mode is not passed then it will run all the validations 
	    # adding all the checks to result set
	    try {
	        # Connectivity checks
	        $validationResults += Invoke-ValidateStorageConnectivity $settings
	        $results = ConvertTo-Json $validationResults -Compress
	        
	        $validationResults += Invoke-ValidateSQLConnectivity $settings
	        $results = ConvertTo-Json $validationResults -Compress
	
	        $validationResults += Invoke-ValidateDnsIpAddress $settings
	        $results = ConvertTo-Json $validationResults -Compress
	
	        $validationResults += Invoke-ValidateDomainControllerConnectivity $settings
	        $results = ConvertTo-Json $validationResults -Compress
	
	        # Parameter validations
	        $validationResults += Invoke-ValidateDomainJoin $settings
	        $results = ConvertTo-Json $validationResults -Compress
	
	        $validationResults += Invoke-ValidateStaticIPAddressAndDnsname $settings
	        $results = ConvertTo-Json $validationResults -Compress
	
	        $validationResults += Invoke-ValidateComputerGroup $settings
	        $results = ConvertTo-Json $validationResults -Compress
	
	        $validationResults += Invoke-ValidategMSAAccount $settings
	        $results = ConvertTo-Json $validationResults -Compress
	            
	        $validationResults += Invoke-ValidateLocalAdminOverideByGPO $settings
	        $results = ConvertTo-Json $validationResults -Compress
	    }
	    catch {
	        Write-Verbose -Verbose  $_
    }
   ```

   > [!NOTE]
   > Operations Manager admin validations include a check for any GPO policies that override the local administrator group. It might take a long time to finish because the check queries all the policies for assessment.

1. The validation script displays all the validation checks and their respective errors, which helps in resolving the validation issues. For fast resolution, run the script in PowerShell ISE with a breakpoint, which can speed up the debugging process.

     If all the checks pass successfully, return to the onboarding page and start the onboarding process.

## Active Directory admin self-verification of steps

To minimize back-and-forth communication with the Operations Manager admin, it's a good practice for the Active Directory admin to independently assess the Active Directory parameters. If needed, you can seek assistance from the Operations Manager admin to run the validation tool to ensure a smoother and more efficient process of parameter evaluation.

Performing Active Directory admin self-verification is an optional step. We provide the flexibility for each organization to decide whether to undertake this process based on their convenience and specific requirements.

Follow these steps to run the validation script:

1. Generate a new VM running on Windows Server 2022 or 2019 within the chosen subnet for the SCOM managed instance creation. Sign in to the VM and configure its DNS server to use the same DNS server IP that you plan to use during the creation of the SCOM managed instance. If the test VM is already created by Operations Manager admin, then use the test VM. For example, see the following screenshot to set the DNS server IP.

     :::image type="DNS server IP" source="media/scom-managed-instance-self-verification-of-steps/dns-server-ip.png" alt-text="Screenshot that shows the DNS server IP.":::

1. [Download the validation script](https://download.microsoft.com/download/2/3/a/23a14c00-8adf-4aba-99ea-6c80fb321f3b/SCOMMI%20Validation%20and%20Troubleshooter.zip) to the test VM and extract. It consists of five files:
     - `Readme.txt`
     - `ScomValidation.ps1`
     - `RunValidationAsSCOMAdmin.ps1`
     - `RunValidationAsActiveDirectoryAdmin.ps1`
     - `RunValidationAsNetworkAdmin.ps1`

1. Follow the steps mentioned in the `Readme.txt` file to run `RunValidationAsActiveDirectoryAdmin.ps1`. Make sure to fill in the settings value in `RunValidationAsActiveDirectoryAdmin.ps1` with applicable values before you run it.

   ```powershell
   # $settings = @{
   #   Configuration = @{
   #         DomainName="test.com"                 
   #         OuPath= "DC=test,DC=com"           
   #         DNSServerIP = "000.00.0.00"           
   #         UserName="test\testuser"              
   #         Password = "password"                 
   #         ManagementServerGroupName= "ComputerMSG"      
   #         GmsaAccount= "test\testgMSA$"
   #         DnsName= "lbdsnname.test.com"
   #         LoadBalancerIP = "00.00.00.000"
   #     }
   # }
   # Note : Before running this script, please make sure you have provided all the parameters in the settings
   $settings = @{
   Configuration = @{
   DomainName="<domain name>"
   OuPath= "<OU path>"
   DNSServerIP = "<DNS server IP>"
   UserName="<domain user name>"
   Password = "<domain user password>"
   ManagementServerGroupName= "<Computer Management server group name>"
   GmsaAccount= "<GMSA account>"
   DnsName= "<DNS name associated with the load balancer IP address>"
   LoadBalancerIP = "<Load balancer IP address>"
   }
   }
   ```

1. In general, `RunValidationAsActiveDirectoryAdmin.ps1` runs all the validations. If you want to run a specific check, open `ScomValidation.ps1` and comment all other checks, which are under Active Directory admin checks. You can also add a breakpoint in the specific check to debug the check and understand the issues better.

   ```powershell
   # Mode is AD admin then following validations/test will be performed
   if ($mode -eq "ADAdmin") {

       try {
           # Mode is AD admin then following validations/test will be performed
           $validationResults += Invoke-ValidateDnsIpAddress $settings
           $results = ConvertTo-Json $validationResults -Compress

           $validationResults += Invoke-ValidateDomainControllerConnectivity $settings
           $results = ConvertTo-Json $validationResults -Compress

           # Parameter validations
           $validationResults += Invoke-ValidateDomainJoin $settings
           $results = ConvertTo-Json $validationResults -Compress

           $validationResults += Invoke-ValidateStaticIPAddressAndDnsname $settings
           $results = ConvertTo-Json $validationResults -Compress

           $validationResults += Invoke-ValidateComputerGroup $settings
           $results = ConvertTo-Json $validationResults -Compress

           $validationResults += Invoke-ValidategMSAAccount $settings
           $results = ConvertTo-Json $validationResults -Compress
            
           $validationResults += Invoke-ValidateLocalAdminOverideByGPO $settings
           $results = ConvertTo-Json $validationResults -Compress
       }
       catch {
           Write-Verbose -Verbose  $_
       }
   }
   ```

   > [!NOTE]
   > Active Directory admin validations include a check for any GPO policies that override the local administrator group. It might take a long time to finish because the check queries all the policies for assessment.

1. The validation script displays all the validation checks and their respective errors, which helps in resolving validation issues. For fast resolution, run the script in PowerShell ISE with a breakpoint, which can speed up the debugging process.

     If all the checks pass successfully, there are no issues with the Active Directory parameters.

## Network admin self-verification of steps

To minimize back-and-forth communication with the Operations Manager admin, the network admin must independently assess the network configuration. If needed, they can seek assistance from the Operations Manager admin to run the validation tool to ensure a smoother and more efficient process of parameter evaluation.

Performing network admin self-verification is an optional step. We provide the flexibility for each organization to decide whether to undertake this process based on their convenience and specific requirements.

Follow these steps to run the validation script:

1. Generate a new VM running on Windows Server 2022 or 2019 within the chosen subnet for the SCOM managed instance creation. Sign in to the VM and configure its DNS server to use the same DNS server IP that you plan to use during the creation of the SCOM managed instance. If the test VM is already created by the Operations Manager admin, use the test VM. For example, see the following screenshot to set the DNS server IP.

     :::image type="DNS server IP" source="media/scom-managed-instance-self-verification-of-steps/dns-server-ip.png" alt-text="Screenshot of the DNS server IP.":::

1. [Download the validation script](https://download.microsoft.com/download/2/3/a/23a14c00-8adf-4aba-99ea-6c80fb321f3b/SCOMMI%20Validation%20and%20Troubleshooter.zip) to the test VM and extract. It consists of five files:
     - `Readme.txt`
     - `ScomValidation.ps1`
     - `RunValidationAsSCOMAdmin.ps1`
     - `RunValidationAsActiveDirectoryAdmin.ps1`
     - `RunValidationAsNetworkAdmin.ps1`

1. Follow the steps mentioned in the `Readme.txt` file to run `RunValidationAsNetworkAdmin.ps1`. Make sure to fill in the settings value in `RunValidationAsNetworkAdmin.ps1` with applicable values before you run it.

   ```powershell
   # $settings = @{
   #   Configuration = @{
   #         DomainName="test.com"                 
   #         DNSServerIP = "000.00.0.00"
   #	     SqlDatabaseInstance= "<SQL MI Host name>"           
   #     }
   # }
   # Note : Before running this script, please make sure you have provided all the parameters in the settings
   $settings = @{
   Configuration = @{
   DomainName="<domain name>"
   DNSServerIP = "<DNS server IP>"
   SqlDatabaseInstance= "<SQL MI Host name>"
   }
   }
   ```

1. In general, `RunValidationAsNetworkAdmin.ps1` runs all the validations related to network configuration. If you want to run a specific check, open `ScomValidation.ps1` and comment all other checks, which are under network admin checks. You can also add a breakpoint in the specific check to debug the check and understand the issues better.

   ```powershell
	       # Mode is Network admin then following validations/test will be performed
	       try {
	           $validationResults += Invoke-ValidateStorageConnectivity $settings
	           $results = ConvertTo-Json $validationResults -Compress
	        
	           $validationResults += Invoke-ValidateSQLConnectivity $settings
	           $results = ConvertTo-Json $validationResults -Compress
	
	           $validationResults += Invoke-ValidateDnsIpAddress $settings
	           $results = ConvertTo-Json $validationResults -Compress
	
	           $validationResults += Invoke-ValidateDomainControllerConnectivity $settings
	           $results = ConvertTo-Json $validationResults -Compress
	       }
	       catch {
	           Write-Verbose -Verbose  $_
       }
   ```

1. The validation script displays all the validation checks and their respective errors, which helps in resolving validation issues. For fast resolution, run the script in PowerShell ISE with a breakpoint, which can speed up the debugging process.

     If all the checks pass successfully, there are no issues with the network configuration.

## Next steps

- [Create an instance of Azure Monitor SCOM Managed Instance](create-operations-manager-managed-instance.md)
