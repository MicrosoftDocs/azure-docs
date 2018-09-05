---
title: Using API version profiles with GO in Azure Stack | Microsoft Docs
description: Learn about using API version profiles with GO in Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/15/2018
ms.author: sethm
ms.reviewer: sijuman

---

# Use API version profiles with Go in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

## Go and version profiles

A profile is a combination of different resource types with different versions from different services. Using a profile will help you mix and match between different resource types. Profiles can provide:

 - Stability for your application by locking to specific API versions.
 - Compatibility for your application with Azure Stack and regional Azure datacenters.

In the Go SDK, profiles are available under the profiles/ path, with their version in the **YYYY-MM-DD** format. Right now, the latest Azure Stack profile version is **2017-03-09**. To import a given service from a profile, you need to import its corresponding module from the profile. For example, to import **Compute** service from **2017-03-09** profile:

````go
import "github.com/Azure/azure-sdk-for-go/profiles/2017-03-09/compute/mgmt/compute" 
````

## Install Azure SDK for Go

  1. Install Git. For instructions, see [Getting Started - Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
  2. Install the [Go Programming Language](https://golang.org/dl).  
  API profiles for Azure will require Go version 1.9 or newer.
  3. Install the Go Azure SDK and its dependencies by running the following bash command:
  ```
    go get -u -d github.com/Azure/azure-sdk-for-go/...
  ```

### The GO SDK

You can find more information about the Azure GO SDK at:
- The Azure Go SDK at [Installing the Azure SDK for Go](https://docs.microsoft.com/go/azure/azure-sdk-go-install).
- The Azure Go SDK is publicly available on GitHub at [azure-sdk-for-go](https://github.com/Azure/azure-sdk-for-go).

### Go-AutoRest dependencies

The GO SDK depends on the Azure Go-AutoRest modules to send REST requests to Azure Resource Manager endpoints. You will need to import the Azure Go-AutoRest module dependencies from [Azure Go-AutoRest on GitHub](https://github.com/Azure/go-autorest). You can find the install bash commands in the **Install** section.

## How to use GO SDK profiles on Azure Stack

To run a sample of Go code on Azure Stack:
  1. Install Azure SDK for Go and its dependencies. For instruction see the previous section, [Install Azure SDK for Go](#install-azure-sdk-for-go).
  2. Get the metadata information from the Resource Manager endpoint. The endpoint returns a JSON file with the information required to run your Go code.

  > [!Note]  
  > The **ResourceManagerUrl** in the Azure Stack Development Kit (ASDK) is: `https://management.local.azurestack.external/`  
  > The **ResourceManagerUrl** in integrated systems is: `https://management.<location>.ext-<machine-name>.masd.stbtest.microsoft.com/`  
  > To retrieve the metadata required: `<ResourceManagerUrl>/metadata/endpoints?api-version=1.0`
  
  Sample JSON file:

  ```json
  { "galleryEndpoint": "https://portal.local.azurestack.external:30015/",  
    "graphEndpoint": "https://graph.windows.net/",  
    "portal Endpoint": "https://portal.local.azurestack.external/", 
    "authentication": {
      "loginEndpoint": "https://login.windows.net/", 
      "audiences": ["https://management.<yourtenant>.onmicrosoft.com/3cc5febd-e4b7-4a85-a2ed-1d730e2f5928"]
    }
  }
  ```

  3. If not available, create a subscription and save the subscription ID to be used later. For information on creating a subscription, see [Create subscriptions to offers in Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-subscribe-plan-provision-vm). 
  4. Create a service principal with "Subscription" scope and **Owner** role. Save the service principals ID and secret. For information on creating a service principal for Azure Stack, see [Create service principal](https://docs.microsoft.com/azure/azure-stack/azure-stack-create-service-principals#create-service-principal-for-azure-ad). Your Azure Stack environment is set up.
  5. Import a service module from Go SDK profile in your code. The current version of Azure Stack profile is **2017-03-09**. For example, to import network module from **2017-03-09** profile type: 

  ````go
    package main 
    import "github.com/Azure/azure-sdk-for-go/profiles/2017-03-09/network/mgmt/network"
  ````
  
  6. In your function, create and authenticate a client with a **New** Client function call. To create a virtual network client, you can use the following code:  

  ````go
  package main 

  import "github.com/Azure/azure-sdk-for-go/profiles/2017-03-09/network/mgmt/network" 

  func main() { 
      vnetClient := network.NewVirtualNetworksClientWithBaseURI("<baseURI>", "(subscriptionID>")
      vnetClient.Authorizer = autorest.NewBearerAuthorizer(token)
  ````

  Set `<baseURI>` to the **ResourceManagerUrl** value used in step two.
  Set `<subscriptionID>` to the **SubscriptionID** value saved from step three.
  To create token, see Authentication section below.  

  7. Invoke API methods by using the client that you created in the previous step. For example, to create a virtual network by using our client from previous step: 
  
````go
package main

import "github.com/Azure/azure-sdk-for-go/profiles/2017-03-09/network/mgmt/network" 
func main() { 
  vnetC1ient := network.NewVirtualNetworksClientWithBaseURI("<baseURI>", "(subscriptionID>")
  vnetClient .Authorizer = autorest.NewBearerAuthorizer(token)

  vnetClient .CreateOrUpdate( ) 
````
  
  For a complete example of creating a virtual network on Azure Stack by using Go SDK profile, see [Example](#example).

## Authentication

To get the Authorizer property from Azure Active Directory using Go SDK, install the Go-AutoRest modules. These modules should have been already installed with the "Go SDK" installation; if not, install the [authentication package on GitHub](https://github.com/Azure/go-autorest/tree/master/autorest/adal).

The Authorizer must be set as the authorizer for the resource client. There are different methods to get an Authorizer; for a complete list see here.

This section presents a common way to get authorizer tokens on Azure Stack by using client credentials:

  1. If a service principal with owner role on the subscription is available, skip this step. Otherwise create a service principal [instructions]( https://docs.microsoft.com/azure/azure-stack/azure-stack-create-service-principals) and assign it an "owner" role scoped to your subscription [instructions]( https://docs.microsoft.com/azure/azure-stack/azure-stack-create-service-principals#assign-role-to-service-principal). Save the service principal application ID and secret. 

  2. Import **adal** package from Go-AutoRest in your code. 
  
  ````go
  package main
  import "github.com/Azure/go-autorest/autorest/adal" 
  ````

  3. Create an oauthConfig by using NewOAuthConfig method from **adal** module. 
  
  ````go
  package main 

  import "github.com/Azure/go-autorest/autorest/ada1" 

  func CreateToken() (adal.OAuthTokenProvider, error) {
      var token adal.OAuthTokenProvider
      oauthConfig, err := adal.NewOAuthConfig(activeDirectoryEndpoint, tenantID)
  ````
   
  Set `<activeDirectoryEndpoint>` to the value of "loginEndpoint" property from the ResourceManagerUrl metadata retrieved on the previous section of this document.
  Set `<tenantID>` value to your Azure Stack tenant ID. 

  4. Finally, create a service principal token by using NewServicePrincipalToken method from adal module. 

  ````go
  package main 

  import "github.com/Azure/go-autorest/autorest/adal" 

  func CreateToken() (adal.OAuthTokenProvider, error) {
      var token adal.OAuthTokenProvider
      oauthConfig, err := adal.NewOAuthConfig(activeDirectoryEndpoint, tenantID)
      token, err = adal.NewServicePrincipalToken(
          *oauthConfig,
          clientID,
          clientSecret,
          activeDirectoryResourceID)
      return token, err
  ````
  
  Set `<activeDirectoryResourceID>` to one of the values in the "audience" list from the ResourceManagerUrl metadata retrieved on the previous section of this document.  
  Set `<clientID>` to the service principal application ID saved when service principal was created on the previous section of this document.  
  Set `<clientSecret>` to the service principal application Secret saved when service principal was created on the previous section of this document.  

## Example

This section shows a sample of Go code to create virtual network on Azure Stack. For complete examples of Go SDK see [Azure Go SDk samples repository](https://github.com/Azure-Samples/azure-sdk-for-go-samples). Azure Stack samples are available under hybrid/ path inside service folders of the repository.

> [!Note]  
> To run the code in this example, verify that the subscription used has **Network** resource provider listed as **Registered**. To verify it, look for the Subscription in the Azure Stack portal, and click on **Resource providers.**

1. Import required packages in your code. You should use the latest available profile on Azure Stack to import the network module. 
  
  ````go
  package main

  import (
      "context"
      "fmt"
      "github.com/Azure/azure-sdk-for-go/profiles/2017-03-09/network/mgmt/network"
      "github.com/Azure/go-autorest/autorest"
      "github.com/Azure/go-autorest/autorest/adal"
      "github.com/Azure/go-autorest/autorest/to"
  )
  ````

2. Define your environment variables. To create a virtual network you need to have a resource group. 

  ````go
  var (
      activeDirectoryEndpoint = "yourLoginEndpointFromResourceManagerUrlMetadata"
      tenantID = "yourAzureStackTenantID"
      clientID = "yourServicePrincipalApplicationID"
      clientSecret = "yourServicePrincipalSecret"
      activeDirectoryResourceID = "yourAudienceFromResourceManagerUrlMetadata"
      subscriptionID = "yourSubscriptionID"
      baseURI = "yourResourceManagerURL"
      resourceGroupName = "existingResourceGroupName"
  )
  ````

3. Now that you have defined your environment variables, add a method to create authentication token by using **adal** package. See details about authentication in previous section.
  
  ````go
  //CreateToken creates a service principal token
  func CreateToken() (adal.OAuthTokenProvider, error) {
      var token adal.OAuthTokenProvider
      oauthConfig, err := adal.NewOAuthConfig(activeDirectoryEndpoint, tenantID)
      token, err = adal.NewServicePrincipalToken(
          *oauthConfig,
          clientID,
          clientSecret,
          activeDirectoryResourceID)
      return token, err
  }
  ````

4. Add the main method. The main method first gets a token by using the method that is defined in previous step. Then, it creates a client by using network module from profile. Finally, it creates a virtual network. 
  
````go
package main

import (
    "context"
    "fmt"
    "github.com/Azure/azure-sdk-for-go/profiles/2017-03-09/network/mgmt/network"
    "github.com/Azure/go-autorest/autorest"
    "github.com/Azure/go-autorest/autorest/adal"
    "github.com/Azure/go-autorest/autorest/to"
)

var (
    activeDirectoryEndpoint = "yourLoginEndpointFromResourceManagerUrlMetadata"
    tenantID = "yourAzureStackTenantID"
    clientID = "yourServicePrincipalApplicationID"
    clientSecret = "yourServicePrincipalSecret"
    activeDirectoryResourceID = "yourAudienceFromResourceManagerUrlMetadata"
    subscriptionID = "yourSubscriptionID"
    baseURI = "yourResourceManagerURL"
    resourceGroupName = "existingResourceGroupName"
)

//CreateToken creates a service principal token
func CreateToken() (adal.OAuthTokenProvider, error) {
    var token adal.OAuthTokenProvider
    oauthConfig, err := adal.NewOAuthConfig(activeDirectoryEndpoint, tenantID)
    token, err = adal.NewServicePrincipalToken(
        *oauthConfig,
        clientID,
        clientSecret,
        activeDirectoryResourceID)
    return token, err
}

func main() {
    token, _ := CreateToken()
    vnetClient := network.NewVirtualNetworksClientWithBaseURI(baseURI, subscriptionID)
    vnetClient.Authorizer = autorest.NewBearerAuthorizer(token)
    future, _ := vnetClient.CreateOrUpdate(
        context.Background(),
        resourceGroupName,
        "sampleVnetName",
        network.VirtualNetwork{
            Location: to.StringPtr("local"),
            VirtualNetworkPropertiesFormat: &network.VirtualNetworkPropertiesFormat{
                AddressSpace: &network.AddressSpace{
                    AddressPrefixes: &[]string{"10.0.0.0/8"},
                },
                Subnets: &[]network.Subnet{
                    {
                        Name: to.StringPtr("subnetName"),
                        SubnetPropertiesFormat: &network.SubnetPropertiesFormat{
                            AddressPrefix: to.StringPtr("10.0.0.0/16"),
                        },
                    },
                },
            },
        })
    err := future.WaitForCompletion(context.Background(), vnetClient.Client)
    if err != nil {
        fmt.Printf(err.Error())
        return
    }
}

````

## Next steps
* [Install PowerShell for Azure Stack](azure-stack-powershell-install.md)
* [Configure the Azure Stack user's PowerShell environment](azure-stack-powershell-configure-user.md)  
