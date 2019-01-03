---
title: Using API version profiles with .NET SDK in Azure Stack | Microsoft Docs
description: Learn about using API version profiles with .NET in Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: ''
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/07/2018
ms.author: sethm
ms.reviewer: sijuman

---

# Use API version profiles with .NET in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

The .NET SDK for the Azure Stack Resource Manager provides tools to help you build and manage your infrastructure. Resource providers in the SDK include compute, networking, storage, app services, and [KeyVault](../../key-vault/key-vault-whatis.md). The .NET SDK includes 14 NuGet packages. These packages must be downloaded to your project solution each time that incorporates the profile information. However, you can specifically download which resource provider you will use for the 2018-03-01-hybrid or 2017-03-09-profile in order to optimize the memory for your application. Each package consists of a resource provider, the respective API version, and the API profile to which it belongs. API profiles in the .NET SDK enable hybrid cloud development by helping you switch between global Azure resources and resources on Azure Stack.

## .NET and API version profiles

An API profile is a combination of resource providers and API versions. You can use an API profile to get the latest, most stable version of each resource type in a resource provider package.

-   To make use of the latest versions of all the services, use the **latest** profile of the packages. This profile is part of the **Microsoft.Azure.Management** NuGet package.

-   To use the services compatible with Azure Stack, use the **Microsoft.Azure.Management.Profiles.hybrid\_2018\_03\_01.*ResourceProvider*.0.9.0-preview.nupkg** or **Microsoft.Azure.Management.Profiles.hybrid\_2017\_03\_09.*ResourceProvider*.0.9.0-preview.nupkg** packages.

    -   There are two packages for each resource provider for each profile.

    -   Ensure that the **ResourceProvider** portion of the above NuGet package is changed to the correct provider.

-   To use the latest API-version of a service, use the **Latest** profile of the specific NuGet package. For example, if you want to use the **latest-API** version of the compute service alone, use the **latest** profile of the **compute** package. The **latest** profile is part of the **Microsoft.Azure.Management** NuGet package.

-   To use specific API-versions for a resource type in a specific resource provider, use the specific API versions defined inside the package.

You can combine all of the options in the same application.

## Install the Azure .NET SDK

1.  Install Git. For instructions, see [Getting Started - Installing Git][].

2.  To install the correct NuGet packages, see [Finding and installing a package][].

3.  The packages that need to be installed depends on the profile version you would like to use. The package names for the profile versions are:

    1.  **Microsoft.Azure.Management.Profiles.hybrid\_2018\_03\_01.*ResourceProvider*.0.9.0-preview.nupkg**

    2.  **Microsoft.Azure.Management.Profiles.hybrid\_2017\_03\_09.*ResourceProvider*.0.9.0-preview.nupkg**

4.  To install the correct NuGet packages for Visual Studio Code, see the following link to download the [NuGet Package Manager instructions][].

5.  If not available, create a subscription and save the subscription ID to be used later. For instructions to create a subscription, see [Create subscriptions to offers in Azure Stack][].

6.  Create a service principal and save the Client ID and the Client Secret. For instructions on how to create a service principal for Azure Stack, see [Provide applications access to Azure Stack][]. The Client ID is also known as the Application ID when creating a service principal.

7.  Make sure your service principal has the contributor/owner role on your subscription. For instructions on how to assign a role to service principal, see [Provide applications access to Azure Stack][].

## Prerequisites

To use the .NET Azure SDK with Azure Stack, you must supply the following values, and then set values with environment variables. To set the environmental variables, see the instructions following the table for your operating system.

| Value                     | Environment variables   | Description                                                                                                             |
|---------------------------|-------------------------|-------------------------------------------------------------------------------------------------------------------------|
| Tenant ID                 | AZURE_TENANT_ID       | The value of your Azure Stack [*tenant ID*][].                                                                          |
| Client ID                 | AZURE_CLIENT_ID       | The service principal application ID saved when the service principal was created in the previous section of this article. |
| Subscription ID           | AZURE_SUBSCRIPTION_ID | The [*subscription ID*][] is how you access offers in Azure Stack.                                                      |
| Client Secret             | AZURE_CLIENT_SECRET   | The service principal application secret saved when the service principal was created.                                      |
| Resource Manager Endpoint | ARM_ENDPOINT           | See [*the Azure Stack Resource Manager endpoint*][].                                                                    |
| Location                  | RESOURCE_LOCATION     | Location for Azure Stack.

To find the Tenant ID for your Azure Stack, follow the instructions found [here](../azure-stack-csp-ref-operations.md). To set your environment variables, do the following steps:

### Microsoft Windows

To set the environment variables in a Windows command prompt, use the following format:

```shell
Set Azure_Tenant_ID=Your_Tenant_ID
```

### MacOS, Linux, and Unix-based systems

In Unix based systems, you can use the following command:

```shell
Export Azure_Tenant_ID=Your_Tenant_ID
```

### The Azure Stack Resource Manager endpoint

The Microsoft Azure Resource Manager is a management framework that allows administrators to deploy, manage, and monitor Azure resources. Azure Resource Manager can handle these tasks as a group, rather than individually, in a single operation.

You can get the metadata information from the Resource Manager endpoint. The endpoint returns a JSON file with the information required to run your code.

Note the following considerations:

- The **ResourceManagerUrl** in the Azure Stack Development Kit (ASDK) is: https://management.local.azurestack.external/

- The **ResourceManagerUrl** in integrated systems is: `https://management.<location>.ext-<machine-name>.masd.stbtest.microsoft.com/`
To retrieve the metadata required: `<ResourceManagerUrl>/metadata/endpoints?api-version=1.0`

Sample JSON file:

```json
{ 
   "galleryEndpoint": "https://portal.local.azurestack.external:30015/",
   "graphEndpoint": "https://graph.windows.net/",
   "portal Endpoint": "https://portal.local.azurestack.external/",
   "authentication": 
      {
      "loginEndpoint": "https://login.windows.net/",
      "audiences": ["https://management.yourtenant.onmicrosoft.com/3cc5febd-e4b7-4a85-a2ed-1d730e2f5928"]
      }
}
```

## Existing API Profiles

1.  **Microsoft.Azure.Management.Profiles.hybrid\_2018\_03\_01.*ResourceProvider*.0.9.0-preview.nupkg**: Latest Profile built for Azure Stack. Use this profile for services to be most compatible with Azure Stack as long as you are on 1808 stamp or further.

2.  **Microsoft.Azure.Management.Profiles.hybrid\_2017\_03\_09.*ResourceProvider*.0.9.0-preview.nupkg**: If you are on a stamp lower than the 1808 build, use this profile.

3.  **Latest**: Profile consisting of the latest versions of all services. Use the latest versions of all the services. This profile is part of the **Microsoft.Azure.Management** NuGet package.

For more information about Azure Stack and API profiles, see a [Summary of API profiles][].

## Azure .NET SDK API Profile usage

The following code should be used to instantiate a resource management client. Similar code can be used to instantiate other resource provider (Such as compute, network, and storage) clients. 

```csharp
var client = new ResourceManagementClient(armEndpoint, credentials)
{
    SubscriptionId = subscriptionId
};
```

The `credentials` parameter in the above code is required to instantiate a client. The following code generates an authentication token by the tenant ID and the service principal.

```csharp
var azureStackSettings = getActiveDirectoryServiceSettings(armEndpoint);
var credentials = ApplicationTokenProvider.LoginSilentAsync(tenantId, servicePrincipalId, servicePrincipalSecret, azureStackSettings).GetAwaiter().GetResult();
```
The `getActiveDirectoryServiceSettings` call in the code retrieves Azure Stack endpoints from the metadata endpoint. It states the environment variables from the call that is made: 

```csharp
public static ActiveDirectoryServiceSettings getActiveDirectoryServiceSettings(string armEndpoint)
{
    var settings = new ActiveDirectoryServiceSettings();
    try
    {
        var request = (HttpWebRequest)HttpWebRequest.Create(string.Format("{0}/metadata/endpoints?api-version=1.0", armEndpoint));
        request.Method = "GET";
        request.UserAgent = ComponentName;
        request.Accept = "application/xml";
        using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
        {
            using (StreamReader sr = new StreamReader(response.GetResponseStream()))
            {
                var rawResponse = sr.ReadToEnd();
                var deserialized = JObject.Parse(rawResponse);
                var authenticationObj = deserialized.GetValue("authentication").Value<JObject>();
                var loginEndpoint = authenticationObj.GetValue("loginEndpoint").Value<string>();
                var audiencesObj = authenticationObj.GetValue("audiences").Value<JArray>();
                settings.AuthenticationEndpoint = new Uri(loginEndpoint);
                settings.TokenAudience = new Uri(audiencesObj[0].Value<string>());
                settings.ValidateAuthority = loginEndpoint.TrimEnd('/').EndsWith("/adfs", StringComparison.OrdinalIgnoreCase) ? false : true;
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine(String.Format("Could not get AD service settings. Exception: {0}", ex.Message));
    }
    return settings;
}
```
This will enable you to use the API Profile NuGet packages to deploy your application successfully to Azure Stack.

## Samples using API Profiles

The following samples can be used as a reference for creating solutions with .NET and Azure Stack API profiles.
- [Manage Resource Groups](https://github.com/Azure-Samples/hybrid-resources-dotnet-manage-resource-group)
- [Manage Storage Accounts](https://github.com/Azure-Samples/hybird-storage-dotnet-manage-storage-accounts)
- [Manage a Virtual Machine](https://github.com/Azure-Samples/hybrid-compute-dotnet-manage-vm)

## Next steps

For more information about API profiles, see:

- [Manage API version profiles in Azure Stack](azure-stack-version-profiles.md)
- [Resource provider API versions supported by profiles](azure-stack-profiles-azure-resource-manager-versions.md)

  [Getting Started - Installing Git]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
  [Finding and installing a package]: /nuget/tools/package-manager-ui
  [NuGet Package Manager instructions]: https://marketplace.visualstudio.com/items?itemName=jmrog.vscode-nuget-package-manager
  [Create subscriptions to offers in Azure Stack]: ../azure-stack-subscribe-plan-provision-vm.md
  [Provide applications access to Azure Stack]: ../azure-stack-create-service-principals.md
  [*tenant ID*]: ../azure-stack-identity-overview.md
  [*subscription ID*]: ../azure-stack-plan-offer-quota-overview.md#subscriptions
  [*the Azure Stack Resource Manager endpoint*]: ../user/azure-stack-version-profiles-ruby.md#the-azure-stack-resource-manager-endpoint
  [Summary of API profiles]: ../user/azure-stack-version-profiles.md#summary-of-api-profiles
  [Test Project to Virtual Machine, vNet, resource groups, and storage account]: https://github.com/seyadava/azure-sdk-for-net-samples/tree/master/TestProject
  [Use Azure PowerShell to create a service principal with a certificate]: ../azure-stack-create-service-principals.md
  [Run unit tests with Test Explorer.]: /visualstudio/test/run-unit-tests-with-test-explorer?view=vs-2017
