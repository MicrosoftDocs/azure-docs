---
title: Configure a lab to use Remote Desktop Gateway in Azure DevTest Labs | Microsoft Docs
description: Learn how to configure a lab in Azure DevTest Labs with a remote desktop gateway to ensure secure access to the lab VMs without having to expose the RDP port. 
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/25/2019
ms.author: spelluru

---

# Configure your lab in Azure DevTest Labs to use a remote desktop gateway
In Azure DevTest Labs, you can configure a remote desktop gateway for your lab to ensure secure access to the lab virtual machines (VMs) without having to expose the RDP port. The lab provides a central place for your lab users to view and connect to all virtual machines they have access to. The **Connect** button on the **Virtual Machine** page creates a machine-specific RDP file that you can open to connect to the machine. You can further customize and secure the RDP connection by connecting your lab to a remote desktop gateway. This approach is more secure because the lab user authenticates directly to the gateway machine or can use company credentials on a domain-joined gateway machine to connect to their machines. The lab also supports using token authentication to the gateway machine that allows users to connect to their lab virtual machines without having the RDP port exposed to the internet. This article walks through an example on how to set up a lab that uses token authentication to connect to lab machines.

## Architecture of the solution

![Architecture of the solution](./media/configure-lab-remote-desktop-gateway/architecture.png)

1. The [Get RDP file contents](https://docs.microsoft.com/en-us/rest/api/dtl/virtualmachines/getrdpfilecontents) action is called when you select the **Connect** button.1. 
1. The Get RDP file contents action invokes `https://{gateway-hostname}/api/host/{lab-machine-name}/port/{port-number}` to request an authentication token.

    1. `{gateway-hostname}` is the gateway hostname specified on the **Lab Settings** page for your lab in the Azure portal. 
    1. `{lab-machine-name}` is the name of the machine that you're trying to connect.
    1. `{port-number}` is the port on which the connection needs to be made. Usually this port is 3389. If the lab VM is using the [shared IP](devtest-lab-shared-ip.md) feature in DevTest Labs, the port will be different.
1. The remote desktop gateway defers the call from `https://{gateway-hostname}/api/host/{lab-machine-name}/port/{port-number}` to an Azure function to generate the authentication token. The DevTest Labs service automatically includes the function key in the request header. The function key is to be saved in the lab’s key vault. The name for that secret to be shown as **Gateway token secret** on the **Lab Settings** page for the lab.
1. The Azure function is expected to return a token for certificate-based token authentication against the gateway machine.  
1. The Get RDP file contents action then returns the complete RDP file, including the authentication information.
1. You open the RDP file using your preferred RDP connection program. Remember that not all RDP connection programs support token authentication. The authentication token does have an expiration date, set by the function app. Make the connection to the lab VM before the token expires.
1. Once the remote desktop gateway machine authenticates the token in the RDP file, the connection is forwarded to your lab machine.

### Solution requirements
To work with the DevTest Labs token authentication feature, there are a few configuration requirements for the gateway machines, domain name services (DNS), and functions.

### Requirements for remote desktop gateway machines
- SSL certificate must be installed  on the gateway machine to handle HTTPS traffic. The certificate must match the fully qualified domain name (FQDN) of the load balancer for the gateway farm or the FQDN of the machine itself if there's only one machine. Wild-card SSL certificates don't work.  
- A signing certificate installed on gateway machine(s). Create a signing certificate by using [Create-SigningCertificate.ps1](https://github.com/Azure/azure-devtestlab/blob/master/samples/DevTestLabs/GatewaySample/tools/Create-SigningCertificate.ps1) script.
- Install the [Pluggable Authentication](https://code.msdn.microsoft.com/windowsdesktop/Remote-Desktop-Gateway-517d6273) module that supports token authentication for the remote desktop gateway. One example of such a module is `RDGatewayFedAuth.msi` that comes with System Center Virtual Machine Manager (VMM) images. 
- The gateway server can handle requests made to `https://{gateway-hostname}/api/host/{lab-machine-name}/port/{port-number}`.

    The gateway-hostname is the FQDN of the load balancer of the gateway farm or the FQDN of machine itself if there's only one machine. The `{lab-machine-name}` is the name of the lab machine that you're trying to connect, and the `{port-number}` is port on which the connection will be made.  By default, this port is 3389.  However, if the virtual machine is using the [shared IP](devtest-lab-shared-ip.md) feature in DevTest Labs, the port will be different.
- The [Application Routing Request](/iis/extensions/planning-for-arr/using-the-application-request-routing-module) module for Internet Information Server (IIS) can be used to redirect `https://{gateway-hostname}/api/host/{lab-machine-name}/port/{port-number}` requests to the azure function, which handles the request to get a token for authentication.


## Azure function requirements
Azure Function that handles request with format of `https://{function-app-uri}/app/host/{lab-machine-name}/port/{port-number}` and returns the authentication token based on the same signing certificate installed on the gateway machines. The `{function-app-uri}` is the uri used to access the function. The function key is automatically be passed in the header of the request. For a sample function, see [https://github.com/Azure/azure-devtestlab/blob/master/samples/DevTestLabs/GatewaySample/src/RDGatewayAPI/Functions/CreateToken.cs](https://github.com/Azure/azure-devtestlab/blob/master/samples/DevTestLabs/GatewaySample/src/RDGatewayAPI/Functions/CreateToken.cs). 


## Network requirements

- DNS for the FQDN associated with the SSL certificate installed on the gateway machines must direct traffic to the gateway machine or the load balancer of the gateway machine farm.
- If the lab machine uses private IPs, there must be a network path from the gateway machine to the lab machine, either through sharing the same virtual network or using peered virtual networks.

## Configure the lab to use token authentication 
This section shows how to configure a lab to use a remote desktop gateway machine that supports token authentication. This section does not cover how to setup a RD gateway farm itself. For that information, See the Sample to Create Remote Desktop Gateway section at the end of this article. 

Before you update the lab settings, store the key needed to successfully execute the function to return an authentication token in the lab’s key vault. You can get the function key value in the **Manage** page for the function in the Azure portal. For more information on how to save a secret in a key vault, see [Add a secret to Key Vault](../key-vault/quick-create-portal.md#add-a-secret-to-key-vault). Save the name of the secret for later use.

To find the id of the lab’s key vault run the following Azure CLI command: 

```azurecli
az resource show --name {lab-name} --resource-type 'Microsoft.DevTestLab/labs' --resource-group {lab-resource-group-name} --query properties.vaultName
```

Configure the lab to use the token authentication by using these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **All Services**, and then select **DevTest Labs** from the list.
1. From the list of labs, select the desired **lab**.
1. On the lab's page, select **Configuration and policies**.
1. On the left menu, in the **Settings** section, select **Lab settings**.
1. In the **Remote desktop** section, enter the fully qualified domain name (FQDN) or IP address of the remote desktop services gateway machine or farm for the **Gateway hostname** field . This value must match the FQDN of the SSL certificate used on gateway machines.
1. In the **Remote desktop** section, for **Gateway token** secret, enter the name of the secret created earlier. This value is not the function key itself, but the name of the secret in the lab’s key vault that holds the function key.
1. 



