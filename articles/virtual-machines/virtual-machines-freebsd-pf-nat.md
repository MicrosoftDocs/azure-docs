---
title: virtual-machines-freebsd-pf-nat | Microsoft Docs
description: Learn how to deploy a NAT firewall using FreeBSD’s PF in Azure. 
services: virtual-machines-linux
documentationcenter: ''
author: KylieLiang
manager: timlt
editor: ''
tags: azure-service-management

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 02/20/2017
ms.author: kyliel

---
This article introduces how to deploy a NAT firewall using FreeBSD’s PF through Azure template for common web server scenario.

# What is PF?
PF (Packet Filter, also written pf) is a BSD licensed stateful packet filter, a central piece of software for firewalling. PF has since evolved quickly and now has several advantages over other available firewalls. Network Address Translation (NAT) is in PF since day one, then packet scheduler and active queue management have been integrated into PF, by integrating the ALTQ and making it configurable through PF's configuration. Features such as pfsync and CARP for failover and redundancy, authpf for session authentication, and ftp-proxy to ease firewalling the difficult FTP protocol, have also extended PF.
In short, PF is an extremely powerful and feature-rich firewall. 

# Get Started
If you are interested in setting up a secure firewall in the cloud for your web servers then let’s get started. And you also could leverage the scripts used in this ARM template to set up your networking topology.
The ARM (Azure Resource Manager) template set up a FreeBSD virtual machine that performs NAT /redirection using PF and 2 FreeBSD virtual machines with the Nginx web server installed and configured. In addition to performing NAT for the 2 web servers egress traffics, the NAT/redirection virtual machine intercepts HTTP requests and redirect them to the 2 web servers in round-robin fashion. The VNet uses the private non-routable IP address space 10.0.0.2/24 and you can modify the parameters of the template. The ARM template also defines a route table for the whole VNet which is a collection of individual routes used to override Azure default routes based on the destination IP address. 

[pf_topology]:./media/virtual-machines-freebsd-pf-nat/pf_topology.jpg

## Deploy through the Azure Portal
1.	Go to [azure template of pf-freebsd-setup](https://azure.microsoft.com/en-us/resources/templates/pf-freebsd-setup/) or [github link for pf-free-setup template](https://github.com/Azure/azure-quickstart-templates/tree/master/pf-freebsd-setup).
2.	Click “Deploy to Azure”.
3.	It will direct you to login in the Azure portal. 
4.	Once you log in, you will be promoted to create or use existing resource group, key in the admin password, Network Prefix and domain Name Prefix. 
5.	Make sure checkbox “I agree to the terms and conditions stated above” is selected. 
6.	Click “Purchase”. 

[pf_template_setup]:./media/virtual-machines-freebsd-pf-nat/pf_template_setup.jpg

You will see the deployment is kicked off and you can get the NAT firewall and 2 backend virtual machines act as web servers set up in your resource group after about 5 minutes. Then you can access Nginx web server using the public IP of front-end VM from a browser. 

[pf_template_deploy_portal]:./media/virtual-machines-freebsd-pf-nat/pf_template_deploy_portal.jpg

## Deploy through Powershell
After [install and configure Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azureps-cmdlets-docs/), login your Azure account. 

    Login-AzureRmAccount

If you fail to load the login module, please follow the instruction to check the details (such as [about_Execution_Policies](https://msdn.microsoft.com/powershell/reference/5.1/Microsoft.PowerShell.Core/about/about_Execution_Policies)).

Then you can create a resource group and deployment the template. 

    New-AzureRmResourceGroup -Name <resource-group-name> -Location <location>
    New-AzureRmResourceGroupDeployment -Name <deployment-name> -ResourceGroupName <resource-group-name> -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/pf-freebsd-setup/azuredeploy.json

You will be promoted to key in the admin password, Network Prefix and domain Name Prefix. 

If you want to modify the parameters by yourself, you could download [azuredeploy.parameters.json ](https://github.com/Azure/azure-quickstart-templates/blob/master/pf-freebsd-setup/azuredeploy.parameters.json) under the same path and modify the parameters. Then create below deployment with the “-TemplateParameterFile .\azuredeploy.parameters.json”.  

    wget https://raw.githubusercontent.com/ostclilideng/azure-quickstart-templates/master/pf-freebsd-setup/azuredeploy.parameters.json -O azuredeploy.parameters.json
    New-AzureRmResourceGroupDeployment -Name <deployment-name> -ResourceGroupName <resource-group-name> -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/pf-freebsd-setup/azuredeploy.json -TemplateParameterFile .\azuredeploy.parameters.json

After about 5 minutes, you will get below deployment information. 

    DeploymentName          : NATpfdeploy
    ResourceGroupName       : NATpf
    ProvisioningState       : Succeeded
    Timestamp               : 2/20/2017 7:02:19 AM
    Mode                    : Incremental
    TemplateLink            : 
    Parameters              : 
                          Name             Type                       Value     
                          ===============  =========================  ==========
                          frontendPrivateNicIP1  String               10.0.2.5  
                          frontendPrivateNicIP2  String               10.0.0.5  
                          backendVM1PrivateNicIP  String              10.0.2.6  
                          backendVM2PrivateNicIP  String              10.0.2.7  
                          frontendVmSize   String                     Standard_A4
                          frontendVmStorageAccountType  String        Standard_LRS
                          backendVmSize    String                     Standard_A1
                          backendVmStorageAccountType  String         Standard_LRS
                          adminUsername    String                     azureuser 
                          adminPassword    SecureString                         
                          vnetAddressPrefix  String                   10.0.0.0/19
                          publicSubnetAddressPrefix  String           10.0.0.0/23
                          privateSubnetAddressPrefix  String          10.0.2.0/23
                          networkPrefix    String                     NATpfnet 
                          domainNamePrefix  String                    NATpfdomain   
                          _artifactsLocation  String                  https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/pf-freebsd-setup/
                          
    Outputs                 : 
    DeploymentDebugLogLevel :  

## Deploy through Azure CLI
After [install and configure the Azure Cross-Platform Command-Line Interface] (https://docs.microsoft.com/en-us/azure/xplat-cli-install), login your account and kick off the deployment.

    azure config mode arm
    azure login
    azure group create <my-resource-group> <location>
    azure group deployment create <my-resource-group> <my-deployment-name> --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/pf-freebsd-setup/azuredeploy.json

Then you will be promoted to key in the admin password, Network Prefix and domain Name Prefix. 
If you want to modify the parameters by yourself, you could download [azuredeploy.parameters.json ](https://github.com/Azure/azure-quickstart-templates/blob/master/pf-freebsd-setup/azuredeploy.parameters.json) under the same path and modify the parameters. Then run below command line.

    azure group deployment create <my-resource-group> <my-deployment-name> --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/pf-freebsd-setup/azuredeploy.json -e .\azuredeploy.parameters.json

After about 5 minutes, you will get below deployment information.

    data:    DeploymentName     : NATpfdeploy
    data:    ResourceGroupName  : NATpf
    data:    ProvisioningState  : Succeeded
    data:    Timestamp          : Mon Feb 20 2017 16:07:42 GMT+0800 (China Standard Time)
    data:    Mode               : Incremental
    data:    CorrelationId      : xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    data:    DeploymentParameters :
    data:    Name                          Type          Value
    data:    ----------------------------  ------------  --------------------------------------------------------------------------------------------------
    data:    frontendPrivateNicIP1         String        10.0.2.5
    data:    frontendPrivateNicIP2         String        10.0.0.5
    data:    backendVM1PrivateNicIP        String        10.0.2.6
    data:    backendVM2PrivateNicIP        String        10.0.2.7
    data:    frontendVmSize                String        Standard_A4
    data:    frontendVmStorageAccountType  String        Standard_LRS
    data:    backendVmSize                 String        Standard_A1
    data:    backendVmStorageAccountType   String        Standard_LRS
    data:    adminUsername                 String        azureuser
    data:    adminPassword                 SecureString  undefined
    data:    vnetAddressPrefix             String        10.0.0.0/19
    data:    publicSubnetAddressPrefix     String        10.0.0.0/23
    data:    privateSubnetAddressPrefix    String        10.0.2.0/23
    data:    networkPrefix                 String        NATpfnet
    data:    domainNamePrefix              String        NATpfdomain
    data:    _artifactsLocation            String        https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/pf-freebsd-setup/
    info:    group deployment create command OK

## Next Step
Do you want to set up your own NAT in Azure? Open Source, free but secure? Then PF is a good choice. By leveraging [above Azure template](https://github.com/Azure/azure-quickstart-templates/tree/master/pf-freebsd-setup), you just need 5 minutes to set up a NAT firewall with round-robin load balancing using FreeBSD's PF in Azure for common web server scenario.

If you want to learn the offering of FreeBSD in Azure, refer to [introduction to FreeBSD on Azure](./virtual-machines-freebsd-intro-on-azure.md).

If you want to know more about PF, refer to [FreeBSD handbook](https://www.freebsd.org/doc/handbook/firewalls-pf.html) or [PF-User's Guide](https://www.freebsd.org/doc/handbook/firewalls-pf.html).
