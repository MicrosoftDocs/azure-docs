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

### Install Go

You can download and install the latest version of [Go](https://go.dev/doc/install). It will replace the existing Go on your machine. If you want to install multiple Go versions on the same machine, see [Managing Go installations](https://go.dev/doc/manage-install).

### Authentication

You need to get authentication before you use any Azure service. You could either use Azure CLI to sign in or set authentication environment variables.

#### Use Azure CLI to sign in

You can use `az login` in the command line to sign in to Azure via your default browser. Detailed instructions can be found in [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

#### Set environment variables

You need the following values to authenticate to Azure:

-   **Subscription ID**
-   **Client ID**
-   **Client Secret**
-   **Tenant ID**

Obtain these values from the portal by following these instructions:

- Get Subscription ID

    1.  Login into your Azure account
    2.  Select **Subscriptions** in the left sidebar
    3.  Select whichever subscription is needed
    4.  Select **Overview**
    5.  Copy the Subscription ID

- Get Client ID / Client Secret / Tenant ID

    For information on how to get Client ID, Client Secret, and Tenant ID, see [Create a Microsoft Entra application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal).

- Setting Environment Variables

    After you obtain the values, you need to set the following values as your environment variables:

    -   `AZURE_CLIENT_ID`
    -   `AZURE_CLIENT_SECRET`
    -   `AZURE_TENANT_ID`
    -   `AZURE_SUBSCRIPTION_ID`

    To set the following environment variables on your development system:

    **Windows** (Administrator access is required)

    1.  Open the Control Panel
    2.  Select **System Security** > **System**
    3.  Select **Advanced system settings** on the left
    4.  Inside the System Properties window, select the `Environment Variables…` button.
    5.  Select the property you would like to change, then select **Edit…**. If the property name is not listed, then select **New…**.

    **Linux-based OS** :

    ```export AZURE_CLIENT_ID="__CLIENT_ID__"
        export AZURE_CLIENT_SECRET="__CLIENT_SECRET__"
        export AZURE_TENANT_ID="__TENANT_ID__"
        export AZURE_SUBSCRIPTION_ID="__SUBSCRIPTION_ID__"````

## Install the package

The new SDK uses Go modules for versioning and dependency management.

Run the following command to install the packages for this tutorial under your project folder:

```sh
go get github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/compute/armcompute/v5
go get github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/network/armnetwork/v3
go get github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/resources/armresources
go get github.com/Azure/azure-sdk-for-go/sdk/azcore
go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
```


## Provision a virtual machine

```go
package main

import (
	"context"
	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/compute/armcompute/v5"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/network/armnetwork/v3"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/resources/armresources"
	"log"
	"os"
)

func main() {
	subscriptionId := os.Getenv("AZURE_SUBSCRIPTION_ID")

	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("authentication failure: %+v", err)
	}

	// client factory
	resourcesClientFactory, err := armresources.NewClientFactory(subscriptionId, cred, nil)
	if err != nil {
		log.Fatalf("cannot create client factory: %+v", err)
	}

	computeClientFactory, err := armcompute.NewClientFactory(subscriptionId, cred, nil)
	if err != nil {
		log.Fatalf("cannot create client factory: %+v", err)
	}

	networkClientFactory, err := armnetwork.NewClientFactory(subscriptionId, cred, nil)
	if err != nil {
		log.Fatalf("cannot create client factory: %+v", err)
	}

	// Step 1: Provision a resource group
	_, err = resourcesClientFactory.NewResourceGroupsClient().CreateOrUpdate(
		context.Background(),
		"<resourceGroupName>",
		armresources.ResourceGroup{
			Location: to.Ptr("westus"),
		},
		nil,
	)
	if err != nil {
		log.Fatal("cannot create resources group:", err)
	}

	// Step 2: Provision a virtual network
	virtualNetworksClientCreateOrUpdateResponsePoller, err := networkClientFactory.NewVirtualNetworksClient().BeginCreateOrUpdate(
		context.Background(),
		"<resourceGroupName>",
		"<virtualNetworkName>",
		armnetwork.VirtualNetwork{
			Location: to.Ptr("westus"),
			ExtendedLocation: &armnetwork.ExtendedLocation{
				Name: to.Ptr("<edgezoneid>"),
				Type: to.Ptr(armnetwork.ExtendedLocationTypesEdgeZone),
			},
			Properties: &armnetwork.VirtualNetworkPropertiesFormat{
				AddressSpace: &armnetwork.AddressSpace{
					AddressPrefixes: []*string{
						to.Ptr("10.0.0.0/16"),
					},
				},
				Subnets: []*armnetwork.Subnet{
					{
						Name: to.Ptr("test-1"),
						Properties: &armnetwork.SubnetPropertiesFormat{
							AddressPrefix: to.Ptr("10.0.0.0/24"),
						},
					},
				},
			},
		},
		nil,
	)
	if err != nil {
		log.Fatal("network creation failed", err)
	}
	virtualNetworksClientCreateOrUpdateResponse, err := virtualNetworksClientCreateOrUpdateResponsePoller.PollUntilDone(context.Background(), nil)
	if err != nil {
		log.Fatal("cannot create virtual network:", err)
	}
	subnetID := *virtualNetworksClientCreateOrUpdateResponse.Properties.Subnets[0].ID

	// Step 3: Provision an IP address
	publicIPAddressesClientCreateOrUpdateResponsePoller, err := networkClientFactory.NewPublicIPAddressesClient().BeginCreateOrUpdate(
		context.Background(),
		"<resourceGroupName>",
		"<publicIPName>",
		armnetwork.PublicIPAddress{
			Name:     to.Ptr("<publicIPName>"),
			Location: to.Ptr("westus"),
			ExtendedLocation: &armnetwork.ExtendedLocation{
				Name: to.Ptr("<edgezoneid>"),
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
		log.Fatal("public ip creation failed", err)
	}
	publicIPAddressesClientCreateOrUpdateResponse, err := publicIPAddressesClientCreateOrUpdateResponsePoller.PollUntilDone(context.Background(), nil)
	if err != nil {
		log.Fatal("cannot create public ip: ", err)
	}

	// Step 4: Provision the network interface client
	interfacesClientCreateOrUpdateResponsePoller, err := networkClientFactory.NewInterfacesClient().BeginCreateOrUpdate(
		context.Background(),
		"<resourceGroupName>",
		"<networkInterfaceName>",
		armnetwork.Interface{
			Location: to.Ptr("westus"),
			ExtendedLocation: &armnetwork.ExtendedLocation{
				Name: to.Ptr("<edgezoneid>"),
				Type: to.Ptr(armnetwork.ExtendedLocationTypesEdgeZone),
			},
			Properties: &armnetwork.InterfacePropertiesFormat{
				EnableAcceleratedNetworking: to.Ptr(true),
				IPConfigurations: []*armnetwork.InterfaceIPConfiguration{
					{
						Name: to.Ptr("<ipConfigurationName>"),
						Properties: &armnetwork.InterfaceIPConfigurationPropertiesFormat{
							Subnet: &armnetwork.Subnet{
								ID: to.Ptr(subnetID),
							},
							PublicIPAddress: &armnetwork.PublicIPAddress{
								ID: publicIPAddressesClientCreateOrUpdateResponse.ID,
							},
						},
					},
				},
			},
		},
		nil,
	)
	if err != nil {
		log.Fatal("interface creation failed", err)
	}
	interfacesClientCreateOrUpdateResponse, err := interfacesClientCreateOrUpdateResponsePoller.PollUntilDone(context.Background(), nil)
	if err != nil {
		log.Fatal("cannot create interface:", err)
	}

	// Step 5: Provision the virtual machine
	virtualMachinesClientCreateOrUpdateResponsePoller, err := computeClientFactory.NewVirtualMachinesClient().BeginCreateOrUpdate(
		context.Background(),
		"<resourceGroupName>",
		"<vmName>",
		armcompute.VirtualMachine{
			Location: to.Ptr("westus"),
			ExtendedLocation: &armcompute.ExtendedLocation{
				Name: to.Ptr("<edgezoneid>"),
				Type: to.Ptr(armcompute.ExtendedLocationTypesEdgeZone),
			},
			Properties: &armcompute.VirtualMachineProperties{
				StorageProfile: &armcompute.StorageProfile{
					ImageReference: &armcompute.ImageReference{
						Publisher: to.Ptr("<publisher>"),
						Offer:     to.Ptr("<offer>"),
						SKU:       to.Ptr("<sku>"),
						Version:   to.Ptr("<version>"),
					},
				},
				HardwareProfile: &armcompute.HardwareProfile{
					VMSize: to.Ptr(armcompute.VirtualMachineSizeTypesStandardD2SV3),
				},
				OSProfile: &armcompute.OSProfile{
					ComputerName:  to.Ptr("<computerName>"),
					AdminUsername: to.Ptr("<adminUsername>"),
					AdminPassword: to.Ptr("<adminPassword>"),
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
		log.Fatal("virtual machine creation failed", err)
	}
	_, err = virtualMachinesClientCreateOrUpdateResponsePoller.PollUntilDone(context.Background(), nil)
	if err != nil {
		log.Fatal("cannot create virtual machine:", err)
	}
}
```

## Clean up resources

In this tutorial, you created a VM in Azure public MEC by using the Go SDK. If you don't expect to need these resources in the future, use the Azure portal to delete the resource group that you created.

## Next steps

To deploy a virtual machine in Azure public MEC using the Python SDK, advance to the following article:

> [!div class="nextstepaction"]
> [Tutorial: Deploy a virtual machine in Azure public MEC using the Python SDK](tutorial-create-vm-using-python-sdk.md)
