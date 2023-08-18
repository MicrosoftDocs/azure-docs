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

- [Install Go](https://go.dev/doc/install)

- [Install the Azure SDK for Go](/azure/developer/go/azure-sdk-install)

## Create a virtual machine  

1. Add the latest compute Go SDK to your import list. For example:

   ```go
   import ( 
     "github.com/Azure/azure-sdk-for-go/tree/main/services/compute/mgmt/2021-11-01/compute" 
   ) 
   ```

1. Use the following sample as a guide on how to use the Go SDK. You must add the `ExtendedLocation` attribute to the VM API call.

   ```go
   VmClient := compute.NewVirtualMachinesClient(<subscription_id>)
    vmResult, err := vmClient.CreateOrUpdate(
        context.Background(),
        "<resourceGroupName>",
        "<vmName>",
        compute.VirtualMachine{
            Location: to.StringPtr("westus"),
            ExtendedLocation: &compute.ExtendedLocation{
                Name: to.StringPtr("<edgezoneid>"),
                Type: "EdgeZone",
            },
            VirtualMachineProperties: &compute.VirtualMachineProperties{
                StorageProfile: &compute.StorageProfile{
                    ImageReference: &compute.ImageReference{
                        Publisher: to.StringPtr("<PublisherName>"),
                        Offer:     to.StringPtr("<Offer>"),
                        Sku:       to.StringPtr("<SKU>"),
                        Version:   to.StringPtr("<version>"),
                    },
                },
                HardwareProfile: &compute.HardwareProfile{
                    VMSize: "Standard_D2s_v3",
                },
                OsProfile: &compute.OSProfile{
                    ComputerName:  to.StringPtr("<vmname>"),
                    AdminUsername: to.StringPtr("<username>"),
                    AdminPassword: to.StringPtr("password"),
                },
                NetworkProfile: &compute.NetworkProfile{
                    NetworkInterfaces: &[]compute.NetworkInterfaceReference{
                        {
                            ID: nic.ID,
                            NetworkInterfaceReferenceProperties: &compute.NetworkInterfaceReferenceProperties{
                                Primary: to.BoolPtr(true),
                            },
                        },
                    },
                },
            },
        },
    )
   ```

## Create a public IP address

1. Add the latest network Go SDK to your import list.

   ```go
   import ( 
     "github.com/Azure/azure-sdk-for-go/tree/main/services/network/mgmt/2021-05-01/network" 
   ) 
   ```

2. Use the following Go sample as a guide on how to create a public IP address. Azure public MEC supports only the Standard SKU with static allocation for public IPs.

   ```go
   ipClient := network.NewPublicIPAddressesClient("<subsciption_id>")
    PublicIPResult, err := ipClient.CreateOrUpdate(
        context.Background(),
        "resourceGroupName",
        "publicIpName",
        network.PublicIPAddress{
            Name:     to.StringPtr("publicVMIP"),
            Location: to.StringPtr("westus"),
            ExtendedLocation: &network.ExtendedLocation{
                Name: to.StringPtr("microsoftlosangeles1"),
                Type: to.StringPtr("EdgeZone"),
            },
            Sku: &network.PublicIPAddressSku{
                  Name:network.PublicIPAddressSkuName(
                         network.PublicIPAddressSkuNameStandard),
            },
            PublicIPAddressPropertiesFormat: 
                &network.PublicIPAddressPropertiesFormat{
                   PublicIPAllocationMethod: network.Static,
            },
        }
    )
   ```

## Deploy a virtual network and public IP address

Use the following Go sample as a guide to deploy a virtual network and public IP address in an Azure public MEC solution. Populate the `<edgezoneid>` field with a valid value.

```go
package main

import (
    "context"
    "fmt"
    "github.com/Azure/azure-sdk-for-go/sdk/to"
    "github.com/Azure/azure-sdk-for-go/services/network/mgmt/2020-07-01/network"
    "github.com/Azure/go-autorest/autorest/azure/auth"
)

func main() {
    // create a VirtualNetworks client
    vnetClient := network.NewVirtualNetworksClient("<subscription_id>")
    ipClient := network.NewPublicIPAddressesClient("<subscription_id>")
    
    // create a CLI authorizer from environment  Vars
    authorizer, err := auth.NewAuthorizerFromCLI()
    if err == nil {
        fmt.Println("Auth Successful")
        vnetClient.Authorizer = authorizer
        ipClient.Authorizer = authorizer
    } else {
        fmt.Printf("Authorizer error %v", err)
    }
    vnetResult, err := vnetClient.CreateOrUpdate(context.Background(),
        "<resourceGroupName>",
        "<vnetName>",
        network.VirtualNetwork{
            Location: to.StringPtr("westus"),
            ExtendedLocation: &network.ExtendedLocation{
                Name: to.StringPtr("<edgezoneid>")  ,
                Type: to.StringPtr("EdgeZone"),
            },
            VirtualNetworkPropertiesFormat: &network.VirtualNetworkPropertiesFormat{
                AddressSpace: &network.AddressSpace{
                    AddressPrefixes: &[]string{"10.0.0.0/8"},
                },

                Subnets: &[]network.Subnet{
                    {
                        Name: to.StringPtr("subnet1"),
                        SubnetPropertiesFormat: &network.SubnetPropertiesFormat{
                            AddressPrefix: to.StringPtr("10.0.0.0/16"),
                        },
                    },
                    {
                        Name: to.StringPtr("subnet2"),
                        SubnetPropertiesFormat: &network.SubnetPropertiesFormat{
                            AddressPrefix: to.StringPtr("10.1.0.0/16"),
                        },
                    },
                },
            },
        }
    )

    if err != nil {
        fmt.Printf("VNet creation failed %v", err)
    }
    err = vnetResult.WaitForCompletionRef(context.Background(), vnetClient.Client)
    if err != nil {
        fmt.Printf("cannot create a Vnet: %v", err)
    }
   
    pip, err := ipClient.CreateOrUpdate(
        context.Background(),
        "<resourceGroupName>",
        "<publicIPName>",
        network.PublicIPAddress{
            Name:     to.StringPtr("<publicIPName>"),
            Location: to.StringPtr("westus"),
            ExtendedLocation: &network.ExtendedLocation{
                Name: to.StringPtr("microsoftlosangeles1"),
                Type: to.StringPtr("EdgeZone"),
            },
            Sku: &network.PublicIPAddressSku{
                Name: network.PublicIPAddressSkuName(network.PublicIPAddressSkuNameStandard),
            },
            PublicIPAddressPropertiesFormat: &network.PublicIPAddressPropertiesFormat{
                PublicIPAllocationMethod: network.Static,
            },
        },
    )

    if err != nil {
        fmt.Printf("Public IP creation failed %v", err)
    }
    err = pip.WaitForCompletionRef(context.Background(), ipClient.Client)
    if err != nil {
        fmt.Printf("Cannot create Public IP: %v", err)
    }
```

## Clean up resources

In this tutorial, you created a VM in Azure public MEC by using the Go SDK. If you don't expect to need these resources in the future, use the Azure portal to delete the resource group that you created.

## Next steps

To deploy a virtual machine in Azure public MEC using the Python SDK, advance to the following article:

> [!div class="nextstepaction"]
> [Tutorial: Deploy a virtual machine in Azure public MEC using the Python SDK](tutorial-create-vm-using-python-sdk.md)
