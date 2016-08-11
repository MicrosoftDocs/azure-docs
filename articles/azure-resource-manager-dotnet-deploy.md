<properties
   pageTitle="Deploy an SSK enabled VM to Azure using a resource manager template and the .NET SDK for Azure | Microsoft Azure"
   description="Describes how to use the .NET SDK for Azure to deploy a resource group using a resource manager template."
   services="azure-resource-manager"
   documentationCenter=".net"
   authors="allclark"
   manager="douge"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/11/2016"
   ms.author="allclark"/>

# Deploy an SSH enabled VM with a template using .NET

This sample explains how to use Azure Resource Manager templates to deploy your resources to Azure
using the Azure SDK for .NET.

When deploying an application definition with a template, you can provide parameter values to customize how the
resources are created. You specify values for these parameters either inline or in a parameter file.

## Run this sample

1. If you don't have it, install the [.NET Core SDK](https://www.microsoft.com/net/core).

1. Clone the repository.

    ```
    git clone https://github.com/Azure-Samples/resource-manager-dotnet-resources-and-groups.git
    ```

1. Install the dependencies.

    ```
    dotnet restore
    ```

1. Create an Azure service principal either through
    [Azure CLI](resource-group-authenticate-service-principal-cli.md),
    [PowerShell](resource-group-authenticate-service-principal.md),
    or [the portal](resource-group-create-service-principal-portal.md).

1. Add these environment variables to your `.env` file using your subscription id and the tenant id, client id, and client secret from the service principle that you created. 

    ```
    export AZURE_TENANT_ID={your tenant id}
    export AZURE_CLIENT_ID={your client id}
    export AZURE_CLIENT_SECRET={your client secret}
    export AZURE_SUBSCRIPTION_ID={your subscription id}
    ```

1. Run the sample.

    ```
    dotnet run
    ```

## What is program.cs doing?

The sample starts by logging in using your service principal.

```csharp
// Build the service credentials and Azure Resource Manager clients
var serviceCreds = await ApplicationTokenProvider.LoginSilentAsync(tenantId, clientId, secret);
var resourceClient = new ResourceManagementClient(serviceCreds);
resourceClient.SubscriptionId = subscriptionId;
```

Then it creates a resource group into which the VM is deployed.

```
resourceClient.ResourceGroups.CreateOrUpdate(resourceGroupName, new ResourceGroup { Location = westus});
```

### Deploy the template

Now, the sample loads the template and deploys it into the resource group that it created.

```
// build the deployment from a json file template from parameters
var templateParams = new Dictionary<string, Dictionary<string, object>>{
        {"dnsLabelPrefix", new Dictionary<string, object>{{"value", vmDnsLabel}}},
        {"vmName", new Dictionary<string, object>{{"value", "azure-deployment-sample-vm"}}}
    };

var deployParams = new Deployment{
    Properties = new DeploymentProperties{
        Template = JObject.Parse(File.ReadAllText(templateFileLocation)),
        Parameters = templateParams,
        Mode = DeploymentMode.Incremental
    }
};

var sshPubLocation = Path.Combine(Environment.GetEnvironmentVariable("HOME"), ".ssh", "id_rsa.pub");
if(File.Exists(sshPubLocation)){
    Write("Found SSH public key in {0}.", sshPubLocation);
    var pubKey = File.ReadAllText(sshPubLocation);
    Write("Using public key: {0}", pubKey);
    templateParams.Add("sshKeyData", new Dictionary<string, object>{{"value", pubKey}});
}
else
{
    Write("We could not find a RSA public key in {0}. Please create a public key and place it there.", sshPubLocation);
    return;
}

var groupParams = new ResourceGroup { Location = westus};
var deployResult = resourceClient.Deployments.CreateOrUpdate(resourceGroupName, "sample-deploy", deployParams);

Console.ReadLine();

resourceClient.ResourceGroups.Delete(resourceGroupName);
```

## More information

[AZURE.INCLUDE [azure-code-samples-closer](../includes/azure-code-samples-closer.md)]
