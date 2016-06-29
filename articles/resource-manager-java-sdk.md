<properties
   pageTitle="Resource Manager SDK for .Java| Microsoft Azure"
   description="An overview of the Resource Manager Java SDK authentication and usage examples"
   services="azure-resource-manager"
   documentationCenter="na"
   authors="navalev"
   manager=""
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="03/16/2016"
   ms.author="navale;tomfitz;"/>
   
# Azure Resource Manager SDK for Java
   
Azure Resource Manager (ARM) Preview SDKs are available for multiple languages and platforms. Each of these language implementations 
are available through their ecosystem package managers and GitHub.

The code in each of these SDKs is generated from [Azure RESTful API specifications](https://github.com/azure/azure-rest-api-specs). 
These specifications are open source and based on the Swagger v2 specification. The SDK code is generated code via an open source project 
called [AutoRest](https://github.com/azure/autorest). AutoRest transforms these RESTful API specifications into client libraries in multiple languages. 
If there are any aspects of the generated code in the SDKs you would like to improve, the entire set of tools to create the SDKs are open, freely available and based in widely adopted API specification format.

The Azure Resource Manager Java SDK is hosted in GitHub [Azure Java SDK repository](https://github.com/azure/azure-sdk-for-java). Note that at the time of writing this the SDK is in preview.
The following packages are available:

* Compute Management: (azure-mgmt-compute)
* DNS Management: (azure-mgmt-dns)
* Network Management: (azure-mgmt-network)
* Resource Management: (azure-mgmt-resources)
* SQL Management: (azure-mgmt-sql)
* Storage Management: (azure-mgmt-storage)
* Traffic Manager Management: (azure-mgmt-traffic-manager)
* Utilities and Helpers: (azure-mgmt-utility)
* WebSites / WebApps Management: (azure-mgmt-websites)

Follow the Azure SDK for [Java Features Wiki page](https://github.com/Azure/azure-sdk-for-java/wiki/Azure-SDK-for-Java-Features) for an up-to-date list.

## Prerequisites
1. Java v1.6+
2. [maven](https://maven.apache.org/) If you would like to develop on the SDK

## Get the SDK
[Maven](https://maven.apache.org/) distributed jars are the recommended way of getting started with the Azure Java SDK. You can add these dependencies to many
of the Java dependency management tools (Maven, Gradle, Ivy...). Follow this [link](http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22com.microsoft.azure%22) for a listing of the libraries available in maven.

Alternatively, you grab the sdk directly from source using git. To get the source code of the SDK via git:

    git clone https://github.com/Azure/azure-sdk-for-java.git
    cd ./azure-sdk-for-java/

(The samples in this overview will use Maven as the source for the SDK packages)

The SDK include samples for some of the scenarios - authentication, provisioning a VM and more. All can be found in the [azure-mgmt-samples](https://github.com/Azure/azure-sdk-for-java/tree/master/azure-mgmt-samples) GitHub repo. 

## Helper Classes

The SDK includes helper classes for several of the main packages. The helper classes are implemented in the auzre-mgmt-utility package:

* AuthHelper - authentication helper class
* ComputeHelper - compute helper class
* NetworkHelper - network helper class
* ResourceHelper - deployments helper class
* StorageHelper - storage helper class

**Maven dependency information**

    <dependency>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-mgmt-utility</artifactId>
      <version>0.9.1</version>
    </dependency>

This will use the 0.9.1 version of the utility package. 

## Authentication

Authentication for ARM is handled by Azure Active Directory (AD). In order to connect to any API you first need to authenticate 
with Azure AD to receive an authentication token that you can pass on to every request. To get this token you first need to create 
what is called an Azure AD Application and a Service Principal that will be used to login with. 
Follow [Create Azure AD Application and Service Principle](./resource-group-create-service-principal-portal.md) for step by step instructions.

After creating the service principal, you should have:

* Client id (GUID)
* Client secret (string)
* Tenant id (GUID) or domain name (string)

Once you have this values, you can obtain an Active Directory Access Token, valid for one hour.

The Java SDK include a helper class AuthHelper that creates the access token, once provided with the client id, secret and tenant id.
The following example, in the [ServicePrincipalExample](https://github.com/Azure/azure-sdk-for-java/blob/master/azure-mgmt-samples/src/main/java/com/microsoft/azure/samples/authentication/ServicePrincipalExample.java) class,
uses the AuthHelper *getAccessTokenFromServicePrincipalCredentials* method to obtain the access token:

```java
public static Configuration createConfiguration() throws Exception {
   String baseUri = System.getenv("arm.url");

   return ManagementConfiguration.configure(
         null,
         baseUri != null ? new URI(baseUri) : null,
         System.getenv(ManagementConfiguration.SUBSCRIPTION_ID),
         AuthHelper.getAccessTokenFromServicePrincipalCredentials(
                  System.getenv(ManagementConfiguration.URI), System.getenv("arm.aad.url"),
                  System.getenv("arm.tenant"), System.getenv("arm.clientid"),
                  System.getenv("arm.clientkey"))
                  .getAccessToken());
}
```

## Create a Virtual Machine 
The utility package includes a helper class [ComputeHelper](https://github.com/Azure/azure-sdk-for-java/blob/master/resource-management/azure-mgmt-utility/src/main/java/com/microsoft/azure/utility/ComputeHelper.java) to create a virtual machine. 
A few samples for working with virtual machines can be found in the azure-mgmt-samples package under [compute](https://github.com/Azure/azure-sdk-for-java/tree/master/azure-mgmt-samples/src/main/java/com/microsoft/azure/samples/compute).

The following is a simple flow for creating a virtual machine. In this example, the helper class will create the storage and the network as part of creating the VM:

```java
public static void main(String[] args) throws Exception {
        Configuration config = createConfiguration();
        ResourceManagementClient resourceManagementClient = ResourceManagementService.create(config);
        StorageManagementClient storageManagementClient = StorageManagementService.create(config);
        ComputeManagementClient computeManagementClient = ComputeManagementService.create(config);
        NetworkResourceProviderClient networkResourceProviderClient = NetworkResourceProviderService.create(config);

        String resourceGroupName = "javasampleresourcegroup";
        String region = "EastAsia";

        ResourceContext context = new ResourceContext(
                region, resourceGroupName, System.getenv(ManagementConfiguration.SUBSCRIPTION_ID), false);

        System.out.println("Start create vm...");

        try {
            VirtualMachine vm = ComputeHelper.createVM(
                    resourceManagementClient, computeManagementClient, networkResourceProviderClient, 
                    storageManagementClient,
                    context, vnName, vmAdminUser, vmAdminPassword)
              .getVirtualMachine();

            System.out.println(vm.getName() + " is created");
        } catch (Exception ex) {
            System.out.println(ex.toString());
        }
}
```

## Deploy a template
The [ResouceHelper](https://github.com/Azure/azure-sdk-for-java/blob/master/resource-management/azure-mgmt-utility/src/main/java/com/microsoft/azure/utility/ResourceHelper.java) class was created to ease the process of deploying an ARM template with the Java SDK. 

```java
// create a new resource group
ResourceManagementClient resourceManagementClient = createResourceManagementClient();
ResourceContext resourceContext = new ResourceContext(
        resourceGroupLocation, resourceGroupName,
        System.getenv(ManagementConfiguration.SUBSCRIPTION_ID), false);
ComputeHelper.createOrUpdateResourceGroup(resourceManagementClient, resourceContext);

// create the template deployment
DeploymentExtended deployment = ResourceHelper.createTemplateDeploymentFromURI(
        resourceManagementClient,
        resourceGroupName,
        DeploymentMode.Incremental,
        deploymentName,
        TEMPLATE_URI,
        "1.0.0.0",
        parameters);
```
## List all Virtual Machines
You don't have to use the helper classes (though it might make your life easier), but instead use directly service classes for each resource provider. In this example we will list some of the resources under the authenticated subscription - for each resource group, find the virtual machines, and then the IPs associated with it.

```java
// authenticate and get access token
Configuration config = createConfiguration();
ResourceManagementClient resourceManagementClient = ResourceManagementService.create(config);
ComputeManagementClient computeManagementClient = ComputeManagementService.create(config);
NetworkResourceProviderClient networkResourceProviderClient = NetworkResourceProviderService.create(config);

// list all resource groups     
ArrayList<ResourceGroupExtended> resourceGroups = resourceManagementClient.getResourceGroupsOperations().list(null).getResourceGroups();
for (ResourceGroupExtended resourcesGroup : resourceGroups) {
   String rgName = resourcesGroup.getName();
   System.out.println("Resource Group: " + rgName);
   
   // list all virtual machines
   ArrayList<VirtualMachine> vms = computeManagementClient.getVirtualMachinesOperations().list(rgName).getVirtualMachines();
   for (VirtualMachine vm : vms) {
      System.out.println("    VM: " + vm.getName());
      // list all nics
      ArrayList<NetworkInterfaceReference> nics = vm.getNetworkProfile().getNetworkInterfaces();
      for (NetworkInterfaceReference nicReference : nics) {
         String[] nicURI = nicReference.getReferenceUri().split("/");
         NetworkInterface nic = networkResourceProviderClient.getNetworkInterfacesOperations().get(rgName, nicURI[nicURI.length - 1]).getNetworkInterface();
         System.out.println("        NIC: " + nic.getName());
         System.out.println("        Is primary: " + nic.isPrimary());
         ArrayList<NetworkInterfaceIpConfiguration> ips = nic.getIpConfigurations();

         // find public ip address
         for (NetworkInterfaceIpConfiguration ipConfiguration : ips) {
               System.out.println("        Private IP address: " + ipConfiguration.getPrivateIpAddress());
               String[] pipID = ipConfiguration.getPublicIpAddress().getId().split("/");
               PublicIpAddress pip = networkResourceProviderClient.getPublicIpAddressesOperations().get(rgName, pipID[pipID.length - 1]).getPublicIpAddress();
               System.out.println("        Public IP address: " + pip.getIpAddress());
         }
      }
}  
```

More samples can be found in the samples packages under [templatedeployments](https://github.com/Azure/azure-sdk-for-java/tree/master/azure-mgmt-samples/src/main/java/com/microsoft/azure/samples/templatedeployments).

## Further Reading and Help
Azure SDK for Java documentation: [Java docs](http://azure.github.io/azure-sdk-for-java/)

If you encounter any bugs with the SDK please file an issue via [Issues](https://github.com/Azure/azure-sdk-for-java/issues) or checkout [StackOverflow for Azure Java SDK](http://stackoverflow.com/questions/tagged/azure-java-sdk).
