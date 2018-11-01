---
title: Using API version profiles with Java in Azure Stack | Microsoft Docs
description: Learn about using API version profiles with Java in Azure Stack.
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
ms.date: 09/28/2018
ms.author: sethm
ms.reviewer: sijuman

---

# Use API version profiles with Java in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

The Java SDK for the Azure Stack Resource Manager provides tools to help you build and manage your infrastructure. Resource providers in the SDK include compute, networking, storage, app services, and [KeyVault](../../key-vault/key-vault-whatis.md). The Java SDK incorporates API profiles by including dependencies in the Pom.xml file that loads the correct modules in the .java file. However, you can add multiple profiles as dependencies, such as the **2018-03-01-hybrid**, or **latest** as the Azure profile. Using these dependencies loads the correct module so that when you create your resource type, you are able to select which API version from those profiles you want to use. This enables you to use the latest versions in Azure, while developing against the most current API versions for Azure Stack. Using the Java SDK enables a true hybrid cloud developer experience. API profiles in the Java SDK enable hybrid cloud development by helping you switch between global Azure resources and resources in Azure Stack.

## Java and API version profiles

An API profile is a combination of resource providers and API versions. You can use an API profile to get the latest, most stable version of each resource type in a resource provider package.

- To use the latest versions of all the services, use the **latest** profile as the dependency.
    
   - To use the latest profile, the dependency is **com.microsoft.azure**.

   - To use the services compatible with Azure Stack, use the
    **com.microsoft.azure.profile\_2018\_03\_01\_hybrid** profile.
    
      - This is to be specified in the Pom.xml file as a dependency, which loads modules automatically if you choose the right class from the dropdown list as you would with .NET.
        
      - The top of each module appears as follows:         
           `Import com.microsoft.azure.management.resources.v2018_03_01.ResourceGroup`
             

  - Dependencies appear as follows:
     ```xml
     <dependency>
     <groupId>com.microsoft.azure.profile_2018_03_01_hybrid</groupId>
     <artifactId>azure</artifactId>
     <version>1.0.0-beta</version>
     </dependency>
     ```

  - To use specific API-versions for a resource type in a specific resource provider, use the specific API versions defined through intellisense.

Note that you can combine all of the options in the same application.

## Install the Azure Java SDK

Use the following steps to install the Java SDK:

1.  Follow the official instructions to install Git. For instructions, see [Getting Started - Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

2.  Follow the official instructions to install the [Java SDK](http://zulu.org/download/) and [Maven](https://maven.apache.org/). The correct version is version 8 of the Java Developer Kit. The correct Apache Maven is version 3.0 or above. The JAVA_HOME environment variable must be set to the install location of the Java Development Kit to complete the quickstart. For more information, see [Create your first function with Java and Maven](../../azure-functions/functions-create-first-java-maven.md).

3.  To install the correct dependency packages, open the Pom.xml file in your Java application. Add a dependency as shown in the following code:

   ```xml  
   <dependency>
   <groupId>com.microsoft.azure.profile_2018_03_01_hybrid</groupId>
   <artifactId>azure</artifactId>
   <version>1.0.0-beta</version>
   </dependency>
   ```

4.  The packages that need to be installed depends on the profile version you would like to use. The package names for the profile versions are:
    
   - **com.microsoft.azure.profile\_2018\_03\_01\_hybrid**
   - **com.microsoft.azure**
      - **latest**

5.  If not available, create a subscription and save the subscription ID for later use. For instructions on how to create a subscription, see [Create subscriptions to offers in Azure Stack](../azure-stack-subscribe-plan-provision-vm.md).

6.  Create a service principal and save the Client ID and the Client Secret. For instructions on how to create a service principal for Azure Stack, see [Provide applications access to Azure Stack](../azure-stack-create-service-principals.md). Note that the client ID is also known as the application ID when creating a service principal.

7.  Make sure your service principal has the contributor/owner role on your subscription. For instructions on how to assign a role to service principal, see [Provide applications access to Azure Stack](../azure-stack-create-service-principals.md).

## Prerequisites

To use the Azure Java SDK with Azure Stack, you must supply the following values, and then set values with environment variables. To set the environmental variables, see the instructions following the table for your operating system.

| Value                     | Environment variables | Description                                                                                                                                                                                                          |
| ------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tenant ID                 | AZURE_TENANT_ID            | The value of your Azure Stack [<span class="underline">tenant ID</span>](../azure-stack-identity-overview.md).                                                          |
| Client ID                 | AZURE_CLIENT_ID             | The service principal application ID saved when service principal was created on the previous section of this document.                                                                                              |
| Subscription ID           | AZURE_SUBSCRIPTION_ID      | The [<span class="underline">subscription ID</span>](../azure-stack-plan-offer-quota-overview.md#subscriptions) is how you access offers in Azure Stack.                |
| Client Secret             | AZURE_CLIENT_SECRET        | The service principal application Secret saved when service principal was created.                                                                                                                                   |
| Resource Manager Endpoint | ARM_ENDPOINT              | See [<span class="underline">the Azure Stack resource manager endpoint</span>](../user/azure-stack-version-profiles-ruby.md#the-azure-stack-resource-manager-endpoint). |
| Location                  | RESOURCE_LOCATION    | Local for Azure Stack                                                                                                                                                                                                |

To find the tenant ID for your Azure Stack, please follow the instructions found [here](../azure-stack-csp-ref-operations.md). To set your environment variables, do the following:

### Microsoft Windows

To set the environment variables in a Windows command prompt, use the following format:

```shell
Set AZURE_TENANT_ID=<Your_Tenant_ID>
```

### MacOS, Linux, and Unix-based systems

In Unix based systems, you can use the following command:

```shell
Export AZURE_TENANT_ID=<Your_Tenant_ID>
```

### The Azure Stack resource manager endpoint

The Microsoft Azure Resource Manager is a management framework that allows administrators to deploy, manage, and monitor Azure resources. Azure Resource Manager can handle these tasks as a group, rather than individually, in a single operation.

You can get the metadata information from the Resource Manager endpoint. The endpoint returns a JSON file with the information required to run your code.

Note the following considerations:

- The **ResourceManagerUrl** in the Azure Stack Development Kit (ASDK) is: https://management.local.azurestack.external/

- The **ResourceManagerUrl** in integrated systems is: `https://management.<location>.ext-<machine-name>.masd.stbtest.microsoft.com/`

To retrieve the metadata required: `<ResourceManagerUrl>/metadata/endpoints?api-version=1.0`.

Sample JSON file:

```json
{ 
   "galleryEndpoint": "https://portal.local.azurestack.external:30015/",
   "graphEndpoint": "https://graph.windows.net/",
   "portal Endpoint": "https://portal.local.azurestack.external/",
   "authentication": 
      {
      "loginEndpoint": "https://login.windows.net/",
      "audiences": ["https://management.<yourtenant>.onmicrosoft.com/3cc5febd-e4b7-4a85-a2ed-1d730e2f5928"]
      }
}
```

## Existing API Profiles

1.  **com.microsoft.azure.profile\_2018\_03\_01\_hybrid**: Latest profile built for Azure Stack. Use this profile for services to be most compatible with Azure Stack as long as you are on 1808 stamp or further.

2.  **com.microsoft.azure**: Profile consisting of the latest versions of all services. Use the latest versions of all the services.

For more information about Azure Stack and API profiles, see the [Summary
of API profiles](../user/azure-stack-version-profiles.md#summary-of-api-profiles).

## Azure Java SDK API profile usage

The following code authenticates the service principal on Azure Stack. It creates a token by the tenant ID and the authentication base, which is specific to Azure Stack:

```java
AzureTokenCredentials credentials = new ApplicationTokenCredentials(client, tenant, key, AZURE_STACK)
                    .withDefaultSubscriptionId(subscriptionId);
Azure azureStack = Azure.configure()
                    .withLogLevel(com.microsoft.rest.LogLevel.BASIC)
                    .authenticate(credentials, credentials.defaultSubscriptionId());
```

This enables you to use the API profile dependencies to deploy your application successfully to Azure Stack.

## Define Azure Stack environment setting functions

To register the Azure Stack cloud with the correct endpoints, use the following code:

```java
AzureEnvironment AZURE_STACK = new AzureEnvironment(new HashMap<String, String>() {
                {
                    put("managementEndpointUrl", settings.get("audience"));
                    put("resourceManagerEndpointUrl", armEndpoint);
                    put("galleryEndpointUrl", settings.get("galleryEndpoint"));
                    put("activeDirectoryEndpointUrl", settings.get("login_endpoint"));
                    put("activeDirectoryResourceId", settings.get("audience"));
                    put("activeDirectoryGraphResourceId", settings.get("graphEndpoint"));
                    put("storageEndpointSuffix", armEndpoint.substring(armEndpoint.indexOf('.')));
                    put("keyVaultDnsSuffix", ".vault" + armEndpoint.substring(armEndpoint.indexOf('.')));
                }
            });
```

The `getActiveDirectorySettings` call in the following code retrieves the endpoints from the metadata endpoints. It states the environment variables from the call that is made:

```java
public static HashMap<String, String>
getActiveDirectorySettings(String armEndpoint) {

HashMap<String, String> adSettings = new HashMap<String, String>();

try {

// create HTTP Client
HttpClient httpClient = HttpClientBuilder.create().build();

// Create new getRequest with below mentioned URL
HttpGet getRequest = new
HttpGet(String.format("%s/metadata/endpoints?api-version=1.0",
armEndpoint));

// Add additional header to getRequest which accepts application/xml data
getRequest.addHeader("accept", "application/xml");

// Execute request and catch response
HttpResponse response = httpClient.execute(getRequest);
```

## Samples using API profiles

You can use the following GitHub samples as references for creating solutions with .NET and Azure Stack API profiles:

  - [Manage Resource Groups](https://github.com/Azure-Samples/Hybrid-resources-java-manage-resource-group)

  - [Manage Storage Accounts](https://github.com/Azure-Samples/hybrid-storage-java-manage-storage-accounts)

  - [Manage a Virtual Machine](https://github.com/Azure-Samples/hybrid-compute-java-manage-vm)

### Sample Unit Test Project 

1.  Clone the repository using the following command:
    
    `git clone https://github.com/Azure-Samples/Hybrid-resources-java-manage-resource-group.git`

2.  Create an Azure service principal and assign a role to access the subscription. For instructions on creating a service principal, see [Use Azure PowerShell to create a service principal with a certificate](../azure-stack-create-service-principals.md).

3.  Retrieve the following required environment variable values:
    
    -  AZURE_TENANT_ID
    -  AZURE_CLIENT_ID
    -  AZURE_CLIENT_SECRET
    -  AZURE_SUBSCRIPTION_ID
    -  ARM_ENDPOINT
    -  RESOURCE_LOCATION

4.  Set the following environment variables using the information you retrieved from the Service Principal you created using the command prompt:
    
    - export AZURE_TENANT_ID={your tenant id}
    - export AZURE_CLIENT_ID={your client id}
    - export AZURE_CLIENT_SECRET={your client secret}
    - export AZURE_SUBSCRIPTION_ID={your subscription id}
    - export ARM_ENDPOINT={your Azure Stack Resource manager URL}
    - export RESOURCE_LOCATION={location of Azure Stack}

   In Windows, use **set** instead of **export**.

5.  Use the `getactivedirectorysettings` code to retrieve the arm metadata endpoint and use the HTTP client to set the endpoint information.

   ```java
   public static HashMap<String, String> getActiveDirectorySettings(String armEndpoint) {
   HashMap<String, String> adSettings = new HashMap<String,> String>();

   try {

   // create HTTP Client
   HttpClient httpClient = HttpClientBuilder.create().build();

   // Create new getRequest with below mentioned URL
   HttpGet getRequest = new
   HttpGet(String.format("%s/metadata/endpoints?api-version=1.0", armEndpoint));

   // Add additional header to getRequest which accepts application/xml data
   getRequest.addHeader("accept", "application/xml");

   // Execute request and catch response
   HttpResponse response = httpClient.execute(getRequest);
   ```

6.  In the pom.xml file, add the dependency below to use the 2018-03-01-hybrid profile for Azure Stack. This dependency will install the modules associated with this profile for the Compute, Networking, Storage, KeyVault and App Services resource providers.
      
   ```xml
   <dependency>
   <groupId>com.microsoft.azure.profile_2018_03_01_hybrid</groupId>
   <artifactId>azure</artifactId>
   <version>1.0.0-beta</version>
   </dependency>
   ```

8.  In the command prompt that was open to set the environment variables, enter the following line:
    
   ```shell
   mvn clean compile exec:java
   ```

## Next steps

For more information about API profiles, see:

- [Manage API version profiles in Azure Stack](azure-stack-version-profiles.md)
- [Resource provider API versions supported by profiles](azure-stack-profiles-azure-resource-manager-versions.md)
