---
title: Create an Azure Application Gateway - templates | Microsoft Docs
description: This page provides instructions to create an Azure application gateway by using the Azure Resource Manager template
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: tysonn

ms.assetid: 8192ee25-d9f0-4b32-a45e-1d74629c54e5
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/23/2017
ms.author: gwallace

---
# Create an application gateway by using the Azure Resource Manager template

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-gateway-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-gateway-arm.md)
> * [Azure Classic PowerShell](application-gateway-create-gateway.md)
> * [Azure Resource Manager template](application-gateway-create-gateway-arm-template.md)
> * [Azure CLI](application-gateway-create-gateway-cli.md)

Azure Application Gateway is a layer-7 load balancer. It provides failover, performance-routing HTTP requests between different servers, whether they are in the cloud or on-premises.
Application Gateway provides many Application Delivery Controller (ADC) features including HTTP load balancing, cookie-based session affinity, Secure Sockets Layer (SSL) offload, custom health probes, support for multi-site, and many others.

To find a complete list of supported features, visit [Application Gateway Overview](application-gateway-introduction.md)

You learn how to download and modify an existing Azure Resource Manager template from GitHub and deploy the template from GitHub, PowerShell, and the Azure CLI.

If you are simply deploying the Azure Resource Manager template directly from GitHub without any changes, skip to deploy a template from GitHub.

## Scenario

In this scenario you will:

* Create an application gateway with web application firewall.
* Create a virtual network named VirtualNetwork1 with a reserved CIDR block of 10.0.0.0/16.
* Create a subnet called Appgatewaysubnet that uses 10.0.0.0/28 as its CIDR block.
* Set up two previously configured back-end IPs for the web servers you want to load balance the traffic. In this template example, the back-end IPs are 10.0.1.10 and 10.0.1.11.

> [!NOTE]
> Those settings are the parameters for this template. To customize the template, you can change rules, the listener, SSL, and other options in the azuredeploy.json file.

![Scenario](./media/application-gateway-create-gateway-arm-template/scenario.png)

## Download and understand the Azure Resource Manager template

You can download the existing Azure Resource Manager template to create a virtual network and two subnets from GitHub, make any changes you might want, and reuse it. To do so, use the following steps:

1. Navigate to [Create Application Gateway with web application firewall enabled](https://github.com/Azure/azure-quickstart-templates/tree/master/101-application-gateway-waf).
1. Click **azuredeploy.json**, and then click **RAW**.
1. Save the file to a local folder on your computer.
1. If you are familiar with Azure Resource Manager templates, skip to step 7.
1. Open the file that you saved and look at the contents under **parameters** in line
1. Azure Resource Manager template parameters provide a placeholder for values that can be filled out during deployment.

  | Parameter | Description |
  | --- | --- |
  | **subnetPrefix** |CIDR block for the application gateway subnet. |
  | **applicationGatewaySize** | Size of the application gateway.  WAF only allows medium and large. |
  | **backendIpaddress1** |IP address of the first web server. |
  | **backendIpaddress2** |IP address of the second web server. |
  | **wafEnabled** | Setting to determine if WAF is enabled.|
  | **wafMode** | Mode of the web application firewall.  Available options are **prevention** or **detection**.|
  | **wafRuleSetType** | Ruleset type for WAF.  Currently OWASP is the only supported option. |
  | **wafRuleSetVersion** |Ruleset version. OWASP CRS 2.2.9 and 3.0 are currently the supported options. |

1. Check the content under **resources** and notice the following properties:

   * **type**. Type of resource being created by the template. In this case, the type is `Microsoft.Network/applicationGateways`, which represents an application gateway.
   * **name**. Name for the resource. Notice the use of `[parameters('applicationGatewayName')]`, which means that the name is provided as input by you or by a parameter file during deployment.
   * **properties**. List of properties for the resource. This template uses the virtual network and public IP address during application gateway creation.

   > [!NOTE]
   > For more information on templates visit: [Resource Manager templates reference](/templates/)

1. Navigate back to [https://github.com/Azure/azure-quickstart-templates/blob/master/101-application-gateway-waf/](https://github.com/Azure/azure-quickstart-templates/blob/master/101-application-gateway-waf).
1. Click **azuredeploy-parameters.json**, and then click **RAW**.
1. Save the file to a local folder on your computer.
1. Open the file that you saved and edit the values for the parameters. Use the following values to deploy the application gateway described in our scenario.

    ```json
    {
        "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "addressPrefix": {
            "value": "10.0.0.0/16"
            },
            "subnetPrefix": {
            "value": "10.0.0.0/28"
            },
            "applicationGatewaySize": {
            "value": "WAF_Medium"
            },
            "capacity": {
            "value": 2
            },
            "backendIpAddress1": {
            "value": "10.0.1.10"
            },
            "backendIpAddress2": {
            "value": "10.0.1.11"
            },
            "wafEnabled": {
            "value": true
            },
            "wafMode": {
            "value": "Detection"
            },
            "wafRuleSetType": {
            "value": "OWASP"
            },
            "wafRuleSetVersion": {
            "value": "3.0"
            }
        }
    }
    ```

1. Save the file. You can test the JSON template and parameter template by using online JSON validation tools like [JSlint.com](http://www.jslint.com/).

## Deploy the Azure Resource Manager template by using PowerShell

If you have never used Azure PowerShell, visit: [How to install and configure Azure PowerShell](/powershell/azure/overview) and follow the instructions to sign into Azure and select your subscription.

1. Login to PowerShell

    ```powershell
    Login-AzureRmAccount
    ```

1. Check the subscriptions for the account.

    ```powershell
    Get-AzureRmSubscription
    ```

    You are prompted to authenticate with your credentials.

1. Choose which of your Azure subscriptions to use.

    ```powershell
    Select-AzureRmSubscription -Subscriptionid "GUID of subscription"
    ```

1. If needed, create a resource group by using the **New-AzureResourceGroup** cmdlet. In the following example, you create a resource group called AppgatewayRG in East US location.

    ```powershell
    New-AzureRmResourceGroup -Name AppgatewayRG -Location "West US"
    ```

1. Run the **New-AzureRmResourceGroupDeployment** cmdlet to deploy the new virtual network by using the preceding template and parameter files you downloaded and modified.
    
    ```powershell
    New-AzureRmResourceGroupDeployment -Name TestAppgatewayDeployment -ResourceGroupName AppgatewayRG `
    -TemplateFile C:\ARM\azuredeploy.json -TemplateParameterFile C:\ARM\azuredeploy-parameters.json
    ```

## Deploy the Azure Resource Manager template by using the Azure CLI

To deploy the Azure Resource Manager template you downloaded by using Azure CLI, follow the following steps:

1. If you have never used Azure CLI, see [Install and configure the Azure CLI](/cli/azure/install-azure-cli) and follow the instructions up to the point where you select your Azure account and subscription.

1. If necessary, run the `az group create` command to create a resource group, as shown in the following code snippet. Notice the output of the command. The list shown after the output explains the parameters used. For more information about resource groups, visit [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md).

    ```azurecli
    az group create --location westus --name appgatewayRG
    ```
    
    **-n (or --name)**. Name for the new resource group. For our scenario, it's *appgatewayRG*.
    
    **-l (or --location)**. Azure region where the new resource group is created. For our scenario, it's *westus*.

1. Run the `az group deployment create` cmdlet to deploy the new virtual network by using the template and parameter files you downloaded and modified in the preceding step. The list shown after the output explains the parameters used.

    ```azurecli
    az group deployment create --resource-group appgatewayRG --name TestAppgatewayDeployment --template-file azuredeploy.json --parameters @azuredeploy-parameters.json
    ```

## Deploy the Azure Resource Manager template by using click-to-deploy

Click-to-deploy is another way to use Azure Resource Manager templates. It's an easy way to use templates with the Azure portal.

1. Go to [Create an application gateway with web application firewall](https://azure.microsoft.com/documentation/templates/101-application-gateway-waf/).

1. Click **Deploy to Azure**.

    ![Deploy to Azure](./media/application-gateway-create-gateway-arm-template/deploytoazure.png)
    
1. Fill out the parameters for the deployment template on the portal and click **OK**.

    ![Parameters](./media/application-gateway-create-gateway-arm-template/ibiza1.png)
    
1. Select **I agree to the terms and conditions stated above** and click **Purchase**.

1. On the Custom deployment blade, click **Create**.

## Providing certificate data to Resource Manager templates

When using SSL with a template, the certificate needs to be provided in a base64 string instead of being uploaded. To convert a .pfx or .cer to a base64 string run the following PowerShell command. This snippet converts the certificate to a base64 string, which can be provided to the template. The expected output is a string that can be stored in a variable and pasted in the template.

```powershell
[System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes("<certificate path and name>.pfx"))
```

## Delete all resources

To delete all resources created in this article, complete one of the following steps:

### PowerShell

```powershell
Remove-AzureRmResourceGroup -Name appgatewayRG
```

### Azure CLI

```azurecli
az group delete --name appgatewayRG
```

## Next steps

If you want to configure SSL offload, visit: [Configure an application gateway for SSL offload](application-gateway-ssl.md).

If you want to configure an application gateway to use with an internal load balancer, visit: [Create an application gateway with an internal load balancer (ILB)](application-gateway-ilb.md).

If you want more information about load balancing options in general, visit:

* [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
* [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)

