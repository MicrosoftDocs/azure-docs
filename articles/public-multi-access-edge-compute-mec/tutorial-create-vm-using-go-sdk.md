---
title: 'Tutorial: Deploy resources in Azure public MEC using the Go SDK'
description: In this tutorial, learn how to deploy resources in Azure public multi-access edge compute (MEC) by using the Go SDK.
author: vsmsft
ms.author: vivekshah
ms.service: public-multi-access-edge-compute-mec
ms.topic: tutorial
ms.date: 11/22/2022
ms.custom: template-tutorial, devx-track-go
---

# Tutorial: Deploy resources in Azure public MEC using the Go SDK

In this tutorial, you learn how to use the Go SDK to deploy resources in Azure public multi-access edge compute (MEC). The tutorial provides code snippets written in Go to deploy a virtual machine and public IP resources in an Azure public MEC solution. You can use the same model and template to deploy other resources and services that are supported for Azure public MEC. This article isn’t intended to be a tutorial on Go; it focuses only on the API calls required to deploy resources in Azure public MEC.

For more information about Go, see [Azure for Go developers](/azure/developer/go/). For Go samples, see [Azure Go SDK samples](https://github.com/azure-samples/azure-sdk-for-go-samples).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a virtual machine
> - Create a public IP address
> - Deploy a virtual network and public IP address

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Add an allowlisted subscription to your Azure account, which allows you to deploy resources in Azure public MEC. If you don't have an active allowed subscription, contact the [Azure public MEC product team](https://aka.ms/azurepublicmec).

### Upgrade Go version

You could download and install the latest version of Go from [here](https://go.dev/doc/install). It will replace the existing Go on your machine. If you want to install multiple Go versions on the same machine, you could refer this [doc](https://go.dev/doc/manage-install).

### Using Azure CLI to Sign In

You could easily use `az login` in command line to sign in to Azure via your default browser. Detail instructions can be found in [Sign in with Azure CLI](https://docs.microsoft.com/cli/azure/authenticate-azure-cli).

### Setting Environment Variables

You will need the following values to authenticate to Azure

-   **Subscription ID**
-   **Client ID**
-   **Client Secret**
-   **Tenant ID**

These values can be obtained from the portal, here's the instructions:

- Get Subscription ID

    1.  Login into your Azure account
    2.  Select Subscriptions in the left sidebar
    3.  Select whichever subscription is needed
    4.  Click on Overview
    5.  Copy the Subscription ID

- Get Client ID / Client Secret / Tenant ID

    For information on how to get Client ID, Client Secret, and Tenant ID, please refer to [this document](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal)

- Setting Environment Variables

    After you obtained the values, you need to set the following values as your environment variables

    -   `AZURE_CLIENT_ID`
    -   `AZURE_CLIENT_SECRET`
    -   `AZURE_TENANT_ID`
    -   `AZURE_SUBSCRIPTION_ID`

    To set the following environment variables on your development system:

    Windows (Note: Administrator access is required)

    1.  Open the Control Panel
    2.  Click System Security, then System
    3.  Click Advanced system settings on the left
    4.  Inside the System Properties window, click the `Environment Variables…` button.
    5.  Click on the property you would like to change, then click the `Edit…` button. If the property name is not listed, then click the `New…` button.

    Linux-based OS :

        export AZURE_CLIENT_ID="__CLIENT_ID__"
        export AZURE_CLIENT_SECRET="__CLIENT_SECRET__"
        export AZURE_TENANT_ID="__TENANT_ID__"
        export AZURE_SUBSCRIPTION_ID="__SUBSCRIPTION_ID__"

## Install the package

The new SDK uses Go modules for versioning and dependency management.

As an example, to install the Azure Compute module, you would run :

```sh
go get github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/compute/armcompute
go get github.com/Azure/azure-sdk-for-go/sdk/azcore
go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
```


## Create a virtual machine  

1. Add the latest compute Go SDK to your import list. For example:

   ```go
   import ( 
     "github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/compute/armcompute/v5" 
   ) 
   ```

1. Use the following sample as a guide on how to use the Go SDK. You must add the `ExtendedLocation` attribute to the VM API call.

   ```go
	clientFactory, err := armcompute.NewClientFactory(subscriptionId, cred, nil)
	if err != nil {
		log.Fatalf("cannot create client factory: %+v", err)
	}
    virtualMachinesClientCreateOrUpdateResponsePoller, err := clientFactory.NewVirtualMachinesClient().BeginCreateOrUpdate(
	    context.Background(),
		"resourceGroupName",
		"vmName",
		armcompute.VirtualMachine{
			Location: to.Ptr("westus"),
			ExtendedLocation: &armcompute.ExtendedLocation{
				Name: to.Ptr("<edgezoneid>"),
				Type: to.Ptr(armcompute.ExtendedLocationTypesEdgeZone),
			},
			Properties: &armcompute.VirtualMachineProperties{
				StorageProfile: &armcompute.StorageProfile{
					ImageReference: &armcompute.ImageReference{
						Publisher: to.Ptr("<PublisherName>"),
						Offer:     to.Ptr("<Offer>"),
						SKU:       to.Ptr("<SKU>"),
						Version:   to.Ptr("<version>"),
					},
				},
				HardwareProfile: &armcompute.HardwareProfile{
					VMSize: to.Ptr(armcompute.VirtualMachineSizeTypesStandardD2SV3),
				},
				OSProfile: &armcompute.OSProfile{
					ComputerName:  to.Ptr("<vmname>"),
					AdminUsername: to.Ptr("<username>"),
					AdminPassword: to.Ptr("password"),
				},
				NetworkProfile: &armcompute.NetworkProfile{
					NetworkInterfaces: []*armcompute.NetworkInterfaceReference{
						{
							ID: interfacesClientCreateOrUpdateResponse.ID,
							Properties: &armcompute.NetworkInterfaceReferenceProperties{
								Primary: to.Ptr(true),
							},
						},
					},
				},
			},
		},
		nil,
	)
	if err != nil {
		log.Fatalf("failed to finish the request: %v", err)
	}
	_, err = virtualMachinesClientCreateOrUpdateResponsePoller.PollUntilDone(context.Background(), nil)
	if err != nil {
		log.Fatalf("failed to pull the result: %v", err)
	}
   ```

## Create a public IP address

1. Add the latest network Go SDK to your import list.

   ```go
   import ( 
     "github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/network/armnetwork/v3"
   ) 
   ```

2. Use the following Go sample as a guide on how to create a public IP address. Azure public MEC supports only the Standard SKU with static allocation for public IPs.

   ```go
	clientFactory, err := armnetwork.NewClientFactory(subscriptionId, cred, nil)
	if err != nil {
		log.Fatalf("cannot create client factory: %+v", err)
	}
	publicIPAddressesClientCreateOrUpdateResponsePoller, err := clientFactory.NewPublicIPAddressesClient().BeginCreateOrUpdate(
		context.Background(),
		"<resourceGroupName>",
		"<publicIPName>",
		armnetwork.PublicIPAddress{
			Name:     to.Ptr("publicVMIP"),
			Location: to.Ptr("westus"),
			ExtendedLocation: &armnetwork.ExtendedLocation{
				Name: to.Ptr("microsoftlosangeles1"),
				Type: to.Ptr(armnetwork.ExtendedLocationTypesEdgeZone),
			},
			SKU: &armnetwork.PublicIPAddressSKU{
				Name: to.Ptr(armnetwork.PublicIPAddressSKUNameStandard),
			},
			Properties: &armnetwork.PublicIPAddressPropertiesFormat{
				PublicIPAllocationMethod: to.Ptr(armnetwork.IPAllocationMethodStatic),
			},
		},
		nil,
	)
	if err != nil {
		fmt.Printf("Public IP creation failed %v", err)
	}
	_, err = publicIPAddressesClientCreateOrUpdateResponsePoller.PollUntilDone(context.Background(), nil)
	if err != nil {
		fmt.Printf("Cannot create Public IP: %v", err)
	}
   ```

## Deploy a virtual network and public IP address

Use the following Go sample as a guide to deploy a virtual network and public IP address in an Azure public MEC solution. Populate the `<edgezoneid>` field with a valid value.

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/network/armnetwork/v3"
)

func main() {
	subscriptionId := os.Getenv("AZURE_SUBSCRIPTION_ID")

	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("authentication failure: %+v", err)
	}

	// create a VirtualNetworks client
	clientFactory, err := armnetwork.NewClientFactory(subscriptionId, cred, nil)
	if err != nil {
		log.Fatalf("cannot create client factory: %+v", err)
	}

	virtualNetworksClientCreateOrUpdateResponsePoller, err := clientFactory.NewVirtualNetworksClient().BeginCreateOrUpdate(
		context.Background(),
		"resourceGroupName",
		"vnetName",
		armnetwork.VirtualNetwork{
			Location: to.Ptr("westus"),
			ExtendedLocation: &armnetwork.ExtendedLocation{
				Name: to.Ptr("<edgezoneid>"),
				Type: to.Ptr(armnetwork.ExtendedLocationTypesEdgeZone),
			},
			Properties: &armnetwork.VirtualNetworkPropertiesFormat{
				AddressSpace: &armnetwork.AddressSpace{
					AddressPrefixes: []*string{
						to.Ptr("10.0.0.0/8"),
					},
				},
				Subnets: []*armnetwork.Subnet{
					{
						Name: to.Ptr("subnet1"),
						Properties: &armnetwork.SubnetPropertiesFormat{
							AddressPrefix: to.Ptr("10.0.0.0/16"),
						},
					},
					{
						Name: to.Ptr("subnet2"),
						Properties: &armnetwork.SubnetPropertiesFormat{
							AddressPrefix: to.Ptr("10.1.0.0/16"),
						},
					},
				},
			},
		},
		nil,
	)
	if err != nil {
		fmt.Printf("VNet creation failed %v", err)
	}
	_, err = virtualNetworksClientCreateOrUpdateResponsePoller.PollUntilDone(context.Background(), nil)
	if err != nil {
		fmt.Printf("cannot create a Vnet: %v", err)
	}

	publicIPAddressesClientCreateOrUpdateResponsePoller, err := clientFactory.NewPublicIPAddressesClient().BeginCreateOrUpdate(
		context.Background(),
		"<resourceGroupName>",
		"<publicIPName>",
		armnetwork.PublicIPAddress{
			Name:     to.Ptr("<publicIPName>"),
			Location: to.Ptr("westus"),
			ExtendedLocation: &armnetwork.ExtendedLocation{
				Name: to.Ptr("microsoftlosangeles1"),
				Type: to.Ptr(armnetwork.ExtendedLocationTypesEdgeZone),
			},
			SKU: &armnetwork.PublicIPAddressSKU{
				Name: to.Ptr(armnetwork.PublicIPAddressSKUNameStandard),
			},
			Properties: &armnetwork.PublicIPAddressPropertiesFormat{
				PublicIPAllocationMethod: to.Ptr(armnetwork.IPAllocationMethodStatic),
			},
		},
		nil,
	)
	if err != nil {
		fmt.Printf("Public IP creation failed %v", err)
	}
	_, err = publicIPAddressesClientCreateOrUpdateResponsePoller.PollUntilDone(context.Background(), nil)
	if err != nil {
		fmt.Printf("Cannot create Public IP: %v", err)
	}
}
```

## Clean up resources

In this tutorial, you created a VM in Azure public MEC by using the Go SDK. If you don't expect to need these resources in the future, use the Azure portal to delete the resource group that you created.

## Next steps

To deploy a virtual machine in Azure public MEC using the Python SDK, advance to the following article:

> [!div class="nextstepaction"]
> [Tutorial: Deploy a virtual machine in Azure public MEC using the Python SDK](tutorial-create-vm-using-python-sdk.md)
