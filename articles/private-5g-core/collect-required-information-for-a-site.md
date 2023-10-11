---
title: Collect information for a site
titleSuffix: Azure Private 5G Core
description: Learn about the information you'll need to create a site in an existing private mobile network.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 02/07/2022
ms.custom: template-how-to
zone_pivot_groups: ase-pro-version
---

# Collect the required information for a site

Azure Private 5G Core private mobile networks include one or more sites. Each site represents a physical enterprise location (for example, Contoso Corporation's Chicago factory) containing an Azure Stack Edge device that hosts a packet core instance. This how-to guide takes you through the process of collecting the information you'll need to create a new site.

You can use this information to create a site in an existing private mobile network using the [Azure portal](create-a-site.md). You can also use it as part of an ARM template to [deploy a new private mobile network and site](deploy-private-mobile-network-with-site-arm-template.md), or [add a new site to an existing private mobile network](create-site-arm-template.md).

## Prerequisites

- You must have completed the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- If you want to give Azure role-based access control (Azure RBAC) to storage accounts, you must have the relevant permissions on your account.
- Make a note of the resource group that contains your private mobile network that was collected in [Collect the required information to deploy a private mobile network](collect-required-information-for-private-mobile-network.md). We recommend that the mobile network site resource you create in this procedure belongs to the same resource group.

## Choose a service plan

Choose the service plan that will best fit your requirements and verify pricing and charges. See [Azure Private 5G Core pricing](https://azure.microsoft.com/pricing/details/private-5g-core/).

## Collect mobile network site resource values

Collect all the values in the following table for the mobile network site resource that will represent your site.

   |Value  |Field name in Azure portal  |
   |---------|---------|
   |The Azure subscription to use to create the mobile network site resource. You must use the same subscription for all resources in your private mobile network deployment.                  |**Project details: Subscription**|
   |The Azure resource group in which to create the mobile network site resource. We recommend that you use the same resource group that already contains your private mobile network.                |**Project details: Resource group**|
   |The name for the site.           |**Instance details: Name**|
   |The region in which you deployed the private mobile network.                         |**Instance details: Region**|
   |The packet core in which to create the mobile network site resource.                         |**Instance details: Packet core name**|
   |The [region code name](region-code-names.md) of the region in which you deployed the private mobile network.</br></br>You only need to collect this value if you're going to create your site using an ARM template.                         |Not applicable.|
   |The mobile network resource representing the private mobile network to which you’re adding the site. </br></br>You only need to collect this value if you're going to create your site using an ARM template.                         |Not applicable.|
   |The service plan for the site that you are creating. See [Azure Private 5G Core pricing](https://azure.microsoft.com/pricing/details/private-5g-core/). |**Instance details: Service plan**|

## Collect packet core configuration values

Collect all the values in the following table for the packet core instance that will run in the site.

   |Value  |Field name in Azure portal  |
   |---------|---------|
   |The core technology type the packet core instance should support (5G or 4G). |**Technology type**|
   | The Azure Stack Edge resource representing the Azure Stack Edge Pro device in the site. You created this resource as part of the steps in [Order and set up your Azure Stack Edge Pro device(s)](complete-private-mobile-network-prerequisites.md#order-and-set-up-your-azure-stack-edge-pro-devices).</br></br> If you're going to create your site using the Azure portal, collect the name of the Azure Stack Edge resource.</br></br> If you're going to create your site using an ARM template, collect the full resource ID of the Azure Stack Edge resource. You can do this by navigating to the Azure Stack Edge resource, selecting **JSON View** and copying the contents of the **Resource ID** field. | **Azure Stack Edge device** |
   |The custom location that targets the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster on the Azure Stack Edge Pro device in the site. You commissioned the AKS-HCI cluster as part of the steps in [Commission the AKS cluster](commission-cluster.md).</br></br> If you're going to create your site using the Azure portal, collect the name of the custom location.</br></br> If you're going to create your site using an ARM template, collect the full resource ID of the custom location. You can do this by navigating to the Custom location resource, selecting **JSON View** and copying the contents of the **Resource ID** field.|**Custom location**|

## Collect access network values

Collect all the values in the following table to define the packet core instance's connection to the access network over the control plane and user plane interfaces. The field name displayed in the Azure portal will depend on the value you have chosen for **Technology type**, as described in [Collect packet core configuration values](#collect-packet-core-configuration-values).

:::zone pivot="ase-pro-gpu"
   |Value  |Field name in Azure portal  |
   |---------|---------|
   | The IP address for the control plane interface on the access network. For 5G, this interface is the N2 interface; for 4G, it's the S1-MME interface. You identified this address in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-gpu#allocate-subnets-and-ip-addresses). </br></br> This IP address must match the value you used when deploying the AKS-HCI cluster on your Azure Stack Edge Pro device. You did this as part of the steps in [Order and set up your Azure Stack Edge Pro device(s)](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-gpu#order-and-set-up-your-azure-stack-edge-pro-devices). |**N2 address (Signaling)** (for 5G) or **S1-MME address** (for 4G). |
   | The virtual network name on port 5 on your Azure Stack Edge Pro GPU corresponding to the control plane interface on the access network. For 5G, this interface is the N2 interface; for 4G, it's the S1-MME interface. | **ASE N2 virtual subnet** (for 5G) or **ASE S1-MME virtual subnet** (for 4G). |
   | The virtual network name on port 5 on your Azure Stack Edge Pro GPU corresponding to the user plane interface on the access network. For 5G, this interface is the N3 interface; for 4G, it's the S1-U interface. | **ASE N3 virtual subnet** (for 5G) or **ASE S1-U virtual subnet** (for 4G). |
:::zone-end
:::zone pivot="ase-pro-2"
   |Value  |Field name in Azure portal  |
   |---------|---------|
   | The IP address for the control plane interface on the access network. For 5G, this interface is the N2 interface; for 4G, it's the S1-MME interface. You identified this address in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#allocate-subnets-and-ip-addresses). </br></br> This IP address must match the value you used when deploying the AKS-HCI cluster on your Azure Stack Edge Pro device. You did this as part of the steps in [Order and set up your Azure Stack Edge Pro device(s)](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#order-and-set-up-your-azure-stack-edge-pro-devices). |**N2 address (Signaling)** (for 5G) or **S1-MME address** (for 4G). |
   | The virtual network name on port 3 on your Azure Stack Edge Pro 2 corresponding to the control plane interface on the access network. For 5G, this interface is the N2 interface; for 4G, it's the S1-MME interface. | **ASE N2 virtual subnet** (for 5G) or **ASE S1-MME virtual subnet** (for 4G). |
   | The virtual network name on port 3 on your Azure Stack Edge Pro 2 corresponding to the user plane interface on the access network. For 5G, this interface is the N3 interface; for 4G, it's the S1-U interface. | **ASE N3 virtual subnet** (for 5G) or **ASE S1-U virtual subnet** (for 4G). |
:::zone-end

## Collect data network values

You can configure up to ten data networks per site. During site creation, you'll be able to choose whether to attach an existing data network or create a new one.

For each data network that you want to configure, collect all the values in the following table. These values define the packet core instance's connection to the data network over the user plane interface, so you need to collect them whether you're creating the data network or using an existing one.

:::zone pivot="ase-pro-gpu"
   |Value  |Field name in Azure portal  |
   |---------|---------|
   | The name of the data network. This could be an existing data network or a new one you'll create during packet core configuration.                 |**Data network name**|
   | The virtual network name on port 6 (or port 5 if you plan to have more than six data networks) on your Azure Stack Edge Pro GPU device corresponding to the user plane interface on the data network. For 5G, this interface is the N6 interface; for 4G, it's the SGi interface. | **ASE N6 virtual subnet** (for 5G) or **ASE SGi virtual subnet** (for 4G). |
   | The network address of the subnet from which dynamic IP addresses must be allocated to user equipment (UEs), given in CIDR notation. You won't need this address if you don't want to support dynamic IP address allocation for this site. You identified this in [Allocate user equipment (UE) IP address pools](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-gpu#allocate-user-equipment-ue-ip-address-pools). The following example shows the network address format. </br></br>`192.0.2.0/24` </br></br>Note that the UE subnets aren't related to the access subnet.    |**Dynamic UE IP pool prefixes**|
   | The network address of the subnet from which static IP addresses must be allocated to user equipment (UEs), given in CIDR notation. You won't need this address if you don't want to support static IP address allocation for this site. You identified this in [Allocate user equipment (UE) IP address pools](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-gpu#allocate-user-equipment-ue-ip-address-pools). The following example shows the network address format. </br></br>`203.0.113.0/24` </br></br>Note that the UE subnets aren't related to the access subnet.    |**Static UE IP pool prefixes**|
   | The Domain Name System (DNS) server addresses to be provided to the UEs connected to this data network. You identified this in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-gpu#allocate-subnets-and-ip-addresses). </br></br>This value may be an empty list if you don't want to configure a DNS server for the data network. In this case, UEs in this data network will be unable to resolve domain names. | **DNS Addresses** |
   |Whether Network Address and Port Translation (NAPT) should be enabled for this data network. NAPT allows you to translate a large pool of private IP addresses for UEs to a small number of public IP addresses. The translation is performed at the point where traffic enters the data network, maximizing the utility of a limited supply of public IP addresses. </br></br>When NAPT is disabled, static routes to the UE IP pools via the appropriate user plane data IP address for the corresponding attached data network must be configured in the data network router. </br></br>If you want to use [UE-to-UE traffic](private-5g-core-overview.md#ue-to-ue-traffic) in this data network, keep NAPT disabled.   |**NAPT**|
:::zone-end
:::zone pivot="ase-pro-2"
   |Value  |Field name in Azure portal  |
   |---------|---------|
   | The name of the data network. This could be an existing data network or a new one you'll create during packet core configuration.                 |**Data network name**|
   | The virtual network name on port 4 (or port 3 if you plan to have more than six data networks) on your Azure Stack Edge Pro 2 device corresponding to the user plane interface on the data network. For 5G, this interface is the N6 interface; for 4G, it's the SGi interface. | **ASE N6 virtual subnet** (for 5G) or **ASE SGi virtual subnet** (for 4G). |
   | The network address of the subnet from which dynamic IP addresses must be allocated to user equipment (UEs), given in CIDR notation. You won't need this address if you don't want to support dynamic IP address allocation for this site. You identified this in [Allocate user equipment (UE) IP address pools](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#allocate-user-equipment-ue-ip-address-pools). The following example shows the network address format. </br></br>`192.0.2.0/24` </br></br>Note that the UE subnets aren't related to the access subnet.    |**Dynamic UE IP pool prefixes**|
   | The network address of the subnet from which static IP addresses must be allocated to user equipment (UEs), given in CIDR notation. You won't need this address if you don't want to support static IP address allocation for this site. You identified this in [Allocate user equipment (UE) IP address pools](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#allocate-user-equipment-ue-ip-address-pools). The following example shows the network address format. </br></br>`203.0.113.0/24` </br></br>Note that the UE subnets aren't related to the access subnet.    |**Static UE IP pool prefixes**|
   | The Domain Name System (DNS) server addresses to be provided to the UEs connected to this data network. You identified this in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#allocate-subnets-and-ip-addresses). </br></br>This value may be an empty list if you don't want to configure a DNS server for the data network. In this case, UEs in this data network will be unable to resolve domain names. | **DNS Addresses** |
   |Whether Network Address and Port Translation (NAPT) should be enabled for this data network. NAPT allows you to translate a large pool of private IP addresses for UEs to a small number of public IP addresses. The translation is performed at the point where traffic enters the data network, maximizing the utility of a limited supply of public IP addresses. </br></br>When NAPT is disabled, static routes to the UE IP pools via the appropriate user plane data IP address for the corresponding attached data network must be configured in the data network router. </br></br>If you want to use [UE-to-UE traffic](private-5g-core-overview.md#ue-to-ue-traffic) in this data network, keep NAPT disabled.   |**NAPT**|
:::zone-end

## Collect values for diagnostics package gathering

You can use a storage account and user assigned managed identity, with write access to the storage account, to gather diagnostics packages for the site.

If you don't want to configure diagnostics package gathering at this stage, you do not need to collect anything. You can configure this after site creation.

If you want to configure diagnostics package gathering during site creation, see [Collect values for diagnostics package gathering](gather-diagnostics.md#collect-values-for-diagnostics-package-gathering).

## Choose the authentication method for local monitoring tools

Azure Private 5G Core provides dashboards for monitoring your deployment and a web GUI for collecting detailed signal traces. You can access these tools using [Microsoft Entra ID](../active-directory/authentication/overview-authentication.md) or a local username and password. We recommend setting up Microsoft Entra authentication to improve security in your deployment.

If you want to access your local monitoring tools using Microsoft Entra ID, after creating a site you'll need to follow the steps in [Enable Microsoft Entra ID for local monitoring tools](enable-azure-active-directory.md).

If you want to access your local monitoring tools using local usernames and passwords, you don't need to set any additional configuration. After deploying the site, set up your username and password by following [Access the distributed tracing web GUI](distributed-tracing.md#access-the-distributed-tracing-web-gui) and [Access the packet core dashboards](packet-core-dashboards.md#access-the-packet-core-dashboards).

You'll be able to change the authentication method later by following [Modify the local access configuration in a site](modify-local-access-configuration.md).

> [!NOTE]
> While in [disconnected mode](disconnected-mode.md), you won't be able to change the local monitoring authentication method or sign in using Microsoft Entra ID. If you expect to need access to your local monitoring tools while the ASE is disconnected, consider using the local username and password authentication method instead.

## Collect local monitoring values

You can use a self-signed or a custom certificate to secure access to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md) at the edge. We recommend that you provide your own HTTPS certificate signed by a globally known and trusted certificate authority (CA), as this provides additional security to your deployment and allows your browser to recognize the certificate signer.

If you don't want to provide a custom HTTPS certificate at this stage, you don't need to collect anything. You'll be able to change this configuration later by following [Modify the local access configuration in a site](modify-local-access-configuration.md).

If you want to provide a custom HTTPS certificate at site creation, follow the steps below.

   1. Either [create an Azure Key Vault](../key-vault/general/quick-create-portal.md) or choose an existing one to host your certificate. Ensure the key vault is configured with **Azure Virtual Machines for deployment** resource access.
   1. Ensure your certificate is stored in your key vault. You can either [generate a Key Vault certificate](../key-vault/certificates/create-certificate.md) or [import an existing certificate to your Key Vault](../key-vault/certificates/tutorial-import-certificate.md?tabs=azure-portal#import-a-certificate-to-your-key-vault). Your certificate must:

      - Be signed by a globally known and trusted CA.
      - Use a private key of type RSA or EC to ensure it's exportable (see [Exportable or non-exportable key](../key-vault/certificates/about-certificates.md) for more information).

      We also recommend setting a DNS name for your certificate.

   1. If you want to configure your certificate to renew automatically, see [Tutorial: Configure certificate auto-rotation in Key Vault](../key-vault/certificates/tutorial-rotate-certificates.md) for information on enabling auto-rotation.

      > [!NOTE]
      >
      > - Certificate validation will always be performed against the latest version of the local access certificate in the Key Vault.
      > - If you enable auto-rotation, it might take up to four hours for certificate updates in the Key Vault to synchronize with the edge location.

   1. Decide how you want to provide access to your certificate. You can use a Key Vault access policy or Azure role-based access control (Azure RBAC).

      - [Assign a Key Vault access policy](../key-vault/general/assign-access-policy.md?tabs=azure-portal). Provide **Get** and **List** permissions under **Secret permissions** and **Certificate permissions** to the **Azure Private MEC** service principal.
      - [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control (RBAC)](../key-vault/general/rbac-guide.md?tabs=azure-cli). Provide **Key Vault Reader** and **Key Vault Secrets User** permissions to the **Azure Private MEC** service principal.
      - If you want to, assign the Key Vault access policy or Azure RBAC to a [user-assigned identity](../active-directory/managed-identities-azure-resources/overview.md).

          - If you have an existing user-assigned identity configured for diagnostic collection you can modify it.
          - Otherwise, you can create a new user-assigned identity.

   1. Collect the values in the following table.

       |Value  |Field name in Azure portal  |
       |---------|---------|
       |The name of the Azure Key Vault containing the custom HTTPS certificate.|**Key vault**|
       |The name of the CA-signed custom HTTPS certificate within the Azure Key Vault. |**Certificate**|

## Next steps

Use the information you've collected to create the site:

- [Create a site - Azure portal](create-a-site.md)
- [Create a site - ARM template](create-site-arm-template.md)
