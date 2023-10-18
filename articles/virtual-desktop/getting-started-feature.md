---
title: Deploy Azure Virtual Desktop with the getting started feature
description: A quickstart guide for how to quickly set up Azure Virtual Desktop with the Azure portal's getting started feature.
author: dknappettmsft
ms.topic: quickstart
ms.date: 08/02/2022
ms.author: daknappe
manager: femila
ms.custom: mode-portal
---

# Deploy Azure Virtual Desktop with the getting started feature

You can quickly deploy Azure Virtual Desktop with the *getting started* feature in the Azure portal. This can be used in smaller scenarios with a few users and apps, or you can use it to evaluate Azure Virtual Desktop in larger enterprise scenarios. It works with existing Active Directory Domain Services (AD DS) or Microsoft Entra Domain Services deployments, or it can deploy Microsoft Entra Domain Services for you. Once you've finished, a user will be able to sign in to a full virtual desktop session, consisting of one host pool (with one or more session hosts), one application group, and one user. To learn about the terminology used in Azure Virtual Desktop, see [Azure Virtual Desktop terminology](environment-setup.md).

Joining session hosts to Microsoft Entra ID with the getting started feature is not supported. If you want to want to join session hosts to Microsoft Entra ID, follow the [tutorial to create a host pool](create-host-pools-azure-marketplace.md).

> [!TIP]
> Enterprises should plan an Azure Virtual Desktop deployment using information from [Enterprise-scale support for Microsoft Azure Virtual Desktop](/azure/cloud-adoption-framework/scenarios/wvd/enterprise-scale-landing-zone). You can also find more a granular deployment process in a [series of tutorials](create-host-pools-azure-marketplace.md), which also cover programmatic methods and less permission.

You can see the list of [resources that will be deployed](#resources-that-will-be-deployed) further down in this article.

## Prerequisites

Please review the [Prerequisites for Azure Virtual Desktop](prerequisites.md) to start for a general idea of what's required, however there are some differences when using the getting started feature that you'll need to meet. Select a tab below to show instructions that are most relevant to your scenario.

> [!TIP]
> If you don't already have other Azure resources, we recommend you select the **New Microsoft Entra Domain Services** tab. This scenario will deploy everything you need to be ready to connect to a full virtual desktop session. If you already have AD DS or Microsoft Entra Domain Services, select the relevant tab for your scenario instead.

# [New Microsoft Entra Domain Services](#tab/new-aadds)

At a high level, you'll need:

- An Azure account with an active subscription
- An account with the [global administrator Microsoft Entra role](../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md) assigned on the Azure tenant and the [owner role](../role-based-access-control/role-assignments-portal.md) assigned on subscription you're going to use.
- No existing Microsoft Entra Domain Services domain deployed in your Azure tenant.
- User names you choose must not include any keywords [that the username guideline list doesn't allow](../virtual-machines/windows/faq.yml#what-are-the-username-requirements-when-creating-a-vm-), and you must use a unique user name that's not already in your Microsoft Entra subscription.
- The user name for AD Domain join UPN should be a unique one that doesn't already exist in Microsoft Entra ID. The getting started feature doesn't support using existing Microsoft Entra user names when also deploying Microsoft Entra Domain Services.

# [Existing AD DS](#tab/existing-adds)

At a high level, you'll need:

- An Azure account with an active subscription.
- An account with the [global administrator Microsoft Entra role](../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md) assigned on the Azure tenant and the [owner role](../role-based-access-control/role-assignments-portal.md) assigned on subscription you're going to use.
- An AD DS domain controller deployed in Azure in the same subscription as the one you choose to use with the getting started feature. Using multiple subscriptions isn't supported. Make sure you know the fully qualified domain name (FQDN).
- Domain admin credentials for your existing AD DS domain
- You must configure [Microsoft Entra Connect](../active-directory/hybrid/whatis-azure-ad-connect.md) on your subscription and make sure the **Users** container is syncing with Microsoft Entra ID. A security group called **AVDValidationUsers** will be created during deployment in the *Users* container by default. You can also pre-create the **AVDValidationUsers** security group in a different organization unit in your existing AD DS domain. You must make sure this group is then synchronized to Microsoft Entra ID. 
- A virtual network in the same Azure region you want to deploy Azure Virtual Desktop to. We recommend that you [create a new virtual network](../virtual-network/quick-create-portal.md) for Azure Virtual Desktop and use [virtual network peering](../virtual-network/virtual-network-peering-overview.md) to peer it with the virtual network for AD DS or Microsoft Entra Domain Services. You also need to make sure you can resolve your AD DS or Microsoft Entra Domain Services domain name from this new virtual network.
- Internet access is required from your domain controller VM to download PowerShell DSC configuration from `https://wvdportalstorageblob.blob.core.windows.net/galleryartifacts/`.

> [!NOTE]
> The PowerShell Desired State Configuration (DSC) extension will be added to your domain controller VM. A configuration will be added called **AddADDSUser** that contains PowerShell scripts to create the security group and test user, and to populate the security group with any users you choose to add during deployment.

# [Existing Microsoft Entra Domain Services](#tab/existing-aadds)

At a high level, you'll need:

- An Azure account with an active subscription.
- An account with the [global administrator Microsoft Entra role](../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md) assigned on the Azure tenant and the [owner role](../role-based-access-control/role-assignments-portal.md) assigned on subscription you're going to use.
- Microsoft Entra Domain Services deployed in the same tenant and subscription. Peered subscriptions aren't supported. Make sure you know the fully qualified domain name (FQDN).
- Your domain admin user needs to have the same UPN suffix in Microsoft Entra ID and Microsoft Entra Domain Services. This means your Microsoft Entra Domain Services name is the same as your `.onmicrosoft.com` tenant name or you've added the domain name used for Microsoft Entra Domain Services as a verified custom domain name to Microsoft Entra ID.
- A Microsoft Entra account that is a member of **AAD DC Administrators** group in Microsoft Entra ID.
- The *forest type* for Microsoft Entra Domain Services must be **User**.
- A virtual network in the same Azure region you want to deploy Azure Virtual Desktop to. We recommend that you [create a new virtual network](../virtual-network/quick-create-portal.md) for Azure Virtual Desktop and use [virtual network peering](../virtual-network/virtual-network-peering-overview.md) to peer it with the virtual network  or Microsoft Entra Domain Services. You also need to make sure you [configure DNS servers](../active-directory-domain-services/tutorial-configure-networking.md#configure-dns-servers-in-the-peered-virtual-network) to resolve your Microsoft Entra Domain Services domain name from this virtual network for Azure Virtual Desktop.

---

> [!IMPORTANT]
> The getting started feature doesn't currently support accounts that use multi-factor authentication. It also does not support personal Microsoft accounts (MSA) or [Microsoft Entra B2B collaboration](../active-directory/external-identities/user-properties.md) users (either member or guest accounts).

## Deployment steps

# [New Microsoft Entra Domain Services](#tab/new-aadds)

Here's how to deploy Azure Virtual Desktop and a new Microsoft Entra Domain Services domain using the getting started feature:

1. Sign in to [the Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Getting started** to open the landing page for the getting started feature, then select **Start**.

1. On the **Basics** tab, complete the following information, then select **Next: Virtual Machines >**:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | The subscription you want to use from the drop-down list. |
   | Identity provider | No identity provider. |
   | Identity service type | Microsoft Entra Domain Services. |
   | Resource group | Enter a name. This will be used as the prefix for the resource groups that are deployed. |
   | Location | The Azure region where your Azure Virtual Desktop resources will be deployed. |
   | Azure admin user name | The user principal name (UPN) of the account with the global administrator Microsoft Entra role assigned on the Azure tenant and the owner role on the subscription that you selected.<br /><br />Make sure this account meets the requirements noted in the [prerequisites](#prerequisites). |
   | Azure admin password | The password for the Azure admin account. |
   | Domain admin user name | The user principal name (UPN) for a new Microsoft Entra account that will be added to a new *AAD DC Administrators* group and used to manage your Microsoft Entra Domain Services domain. The UPN suffix will be used as the Microsoft Entra Domain Services domain name.<br /><br />Make sure this user name meets the requirements noted in the [prerequisites](#prerequisites). |
   | Domain admin password | The password for the domain admin account. |

1. On the **Virtual machines** tab, complete the following information, then select **Next: Assignments >**:

   | Parameter | Value/Description |
   |--|--|
   | Users per virtual machine | Select **Multiple users** or **One user at a time** depending on whether you want users to share a session host or assign a session host to an individual user. Learn more about [host pool types](environment-setup.md#host-pools). Selecting **Multiple users** will also create an Azure Files storage account joined to the same Microsoft Entra Domain Services domain. |
   | Image type | Select **Gallery** to choose from a predefined list, or **storage blob** to enter a URI to the image. |
   | Image | If you chose **Gallery** for image type, select the operating system image you want to use from the drop-down list. You can also select **See all images** to choose an image from the [Azure Compute Gallery](../virtual-machines/azure-compute-gallery.md).<br /><br />If you chose **Storage blob** for image type, enter the URI of the image. |
   | Virtual machine size | The [Azure virtual machine size](../virtual-machines/sizes.md) used for your session host(s) |
   | Name prefix | The name prefix for your session host(s). Each session host will have a hyphen and then a number added to the end, for example **avd-sh-1**. This name prefix can be a maximum of 11 characters and will also be used as the device name in the operating system. |
   | Number of virtual machines | The number of session hosts you want to deploy at this time. You can add more later. |
   | Link Azure template | Tick the box if you want to [link a separate ARM template](../azure-resource-manager/templates/linked-templates.md) for custom configuration on your session host(s) during deployment. You can specify inline deployment script, desired state configuration, and custom script extension. Provisioning other Azure resources in the template isn't supported.<br /><br />Untick the box if you don't want to link a separate ARM template during deployment. |
   | ARM template file URL | The URL of the ARM template file you want to use. This could be stored in a storage account. |
   | ARM template parameter file URL | The URL of the ARM template parameter file you want to use. This could be stored in a storage account. |

1. On the **Assignments** tab, complete the following information, then select **Next: Review + create >**:

   | Parameter | Value/Description |
   |--|--|
   | Create test user account | Tick the box if you want a new user account created during deployment for testing purposes. |
   | Test user name | The user principal name (UPN) of the test account you want to be created, for example `testuser@contoso.com`. This user will be created in your new Microsoft Entra tenant, synchronized to Microsoft Entra Domain Services, and made a member of the **AVDValidationUsers** security group that is also created during deployment. It must contain a valid UPN suffix for your domain that is also [added as a verified custom domain name in Microsoft Entra ID](../active-directory/fundamentals/add-custom-domain.md).<br /><br />Make sure this user name meets the requirements noted in the [prerequisites](#prerequisites). |
   | Test password | The password to be used for the test account. |
   | Confirm password | Confirmation of the password to be used for the test account. |

1. On the **Review + create** tab, ensure validation passes and review the information that will be used during deployment.

1. Select **Create**.

# [Existing AD DS](#tab/existing-adds)

Here's how to deploy Azure Virtual Desktop using the getting started feature where you already have AD DS available:

1. Sign in to [the Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Getting started** to open the landing page for the getting started feature, then select **Start**.

1. On the **Basics** tab, complete the following information, then select **Next: Virtual Machines >**:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | The subscription you want to use from the drop-down list. |
   | Identity provider | Existing Active Directory. |
   | Identity service type | Active Directory. |
   | Resource group | Enter a name. This will be used as the prefix for the resource groups that are deployed. |
   | Location | The Azure region where your Azure Virtual Desktop resources will be deployed. |
   | Virtual network | The virtual network in the same Azure region you want to connect your Azure Virtual Desktop resources to. This must have connectivity to your AD DS domain controller in Azure and be able to resolve its FQDN. |
   | Subnet | The subnet of the virtual network you want to connect your Azure Virtual Desktop resources to. |
   | Azure admin user name | The user principal name (UPN) of the account with the global administrator Microsoft Entra role assigned on the Azure tenant and the owner role on the subscription that you selected.<br /><br />Make sure this account meets the requirements noted in the [prerequisites](#prerequisites). |
   | Azure admin password | The password for the Azure admin account. |
   | Domain admin user name | The user principal name (UPN) of the domain admin account in your AD DS domain. The UPN suffix doesn't need to be added as a custom domain in Azure AD.<br /><br />Make sure this account meets the requirements noted in the [prerequisites](#prerequisites). |
   | Domain admin password | The password for the domain admin account. |

1. On the **Virtual machines** tab, complete the following information, then select **Next: Assignments >**:

   | Parameter | Value/Description |
   |--|--|
   | Users per virtual machine | Select **Multiple users** or **One user at a time** depending on whether you want users to share a session host or assign a session host to an individual user. Learn more about [host pool types](environment-setup.md#host-pools). Selecting **Multiple users** will also create an Azure Files storage account joined to the same AD DS domain. |
   | Image type | Select **Gallery** to choose from a predefined list, or **storage blob** to enter a URI to the image. |
   | Image | If you chose **Gallery** for image type, select the operating system image you want to use from the drop-down list. You can also select **See all images** to choose an image from the [Azure Compute Gallery](../virtual-machines/azure-compute-gallery.md).<br /><br />If you chose **Storage blob** for image type, enter the URI of the image. |
   | Virtual machine size | The [Azure virtual machine size](../virtual-machines/sizes.md) used for your session host(s). |
   | Name prefix | The name prefix for your session host(s). Each session host will have a hyphen and then a number added to the end, for example **avd-sh-1**. This name prefix can be a maximum of 11 characters and will also be used as the device name in the operating system. |
   | Number of virtual machines | The number of session hosts you want to deploy at this time. You can add more later. |
   | Specify domain or unit | Select **Yes** if:<br /><ul><li>The FQDN of your domain is different to the UPN suffix of the domain admin user in the previous step.</li><li>You want to create the computer account in a specific Organizational Unit (OU).</li></ul><br />If you select **Yes** and you only want to specify an OU, you must enter a value for **Domain to join**, even if that is the same as the UPN suffix of the domain admin user in the previous step. Organizational Unit path is optional and if it's left empty, the computer account will be placed in the *Users* container.<br /><br />Select **No** to use the suffix of the Active Directory domain join UPN as the FQDN. For example, the user `vmjoiner@contoso.com` has a UPN suffix of `contoso.com`. The computer account will be placed in the *Users* container. |
   | Domain controller resource group | The resource group that contains your domain controller virtual machine from the drop-down list. The resource group must be in the same subscription you selected earlier. |
   | Domain controller virtual machine | Your domain controller virtual machine from the drop-down list. This is required for creating or assigning the initial user and group. |
   | Link Azure template | Tick the box if you want to [link a separate ARM template](../azure-resource-manager/templates/linked-templates.md) for custom configuration on your session host(s) during deployment. You can specify inline deployment script, desired state configuration, and custom script extension. Provisioning other Azure resources in the template isn't supported.<br /><br />Untick the box if you don't want to link a separate ARM template during deployment. |
   | ARM template file URL | The URL of the ARM template file you want to use. This could be stored in a storage account. |
   | ARM template parameter file URL | The URL of the ARM template parameter file you want to use. This could be stored in a storage account. |

1. On the **Assignments** tab, complete the following information, then select **Next: Review + create >**:

   | Parameter | Value/Description |
   |--|--|
   | Create test user account | Tick the box if you want a new user account created during deployment for testing purposes. |
   | Test user name | The user principal name (UPN) of the test account you want to be created, for example `testuser@contoso.com`. This user will be created in your AD DS domain, synchronized to Microsoft Entra ID, and made a member of the **AVDValidationUsers** security group that is also created during deployment. It must contain a valid UPN suffix for your domain that is also [added as a verified custom domain name in Microsoft Entra ID](../active-directory/fundamentals/add-custom-domain.md).<br /><br />Make sure this user name meets the requirements noted in the [prerequisites](#prerequisites). |
   | Test password | The password to be used for the test account. |
   | Confirm password | Confirmation of the password to be used for the test account. |
   | Assign existing users or groups | You can select existing users or groups by ticking the box and selecting **Add Microsoft Entra users or user groups**. Select Microsoft Entra users or user groups, then select **Select**. These users and groups must be [hybrid identities](../active-directory/hybrid/whatis-hybrid-identity.md), which means the user account is synchronized between your AD DS domain and Microsoft Entra ID. Admin accounts aren’t able to sign in to the virtual desktop. |

1. On the **Review + create** tab, ensure validation passes and review the information that will be used during deployment.

1. Select **Create**.

# [Existing Microsoft Entra Domain Services](#tab/existing-aadds)

Here's how to deploy Azure Virtual Desktop using the getting started feature where you already have Microsoft Entra Domain Services available:

1. Sign in to [the Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Getting started** to open the landing page for the getting started feature, then select **Start**.

1. On the **Basics** tab, complete the following information, then select **Next: Virtual Machines >**:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | The subscription you want to use from the drop-down list. |
   | Identity provider | Existing Active Directory. |
   | Identity service type | Microsoft Entra Domain Services. |
   | Resource group | Enter a name. This will be used as the prefix for the resource groups that are deployed. |
   | Location | The Azure region where your Azure Virtual Desktop resources will be deployed. |
   | Virtual network | The virtual network in the same Azure region you want to connect your Azure Virtual Desktop resources to. This must have connectivity to your Microsoft Entra Domain Services domain and be able to resolve its FQDN. |
   | Subnet | The subnet of the virtual network you want to connect your Azure Virtual Desktop resources to. |
   | Azure admin user name | The user principal name (UPN) of the account with the global administrator Microsoft Entra role assigned on the Azure tenant and the owner role on the subscription that you selected.<br /><br />Make sure this account meets the requirements noted in the [prerequisites](#prerequisites). |
   | Azure admin password | The password for the Azure admin account. |
   | Domain admin user name | The user principal name (UPN) of the admin account to manage your Microsoft Entra Domain Services domain. The UPN suffix of the user in Microsoft Entra ID must match the Microsoft Entra Domain Services domain name.<br /><br />Make sure this account meets the requirements noted in the [prerequisites](#prerequisites). |
   | Domain admin password | The password for the domain admin account. |

1. On the **Virtual machines** tab, complete the following information, then select **Next: Assignments >**:

   | Parameter | Value/Description |
   |--|--|
   | Users per virtual machine | Select **Multiple users** or **One user at a time** depending on whether you want users to share a session host or assign a session host to an individual user. Learn more about [host pool types](environment-setup.md#host-pools). Selecting **Multiple users** will also create an Azure Files storage account joined to the same Microsoft Entra Domain Services domain. |
   | Image type | Select **Gallery** to choose from a predefined list, or **storage blob** to enter a URI to the image. |
   | Image | If you chose **Gallery** for image type, select the operating system image you want to use from the drop-down list. You can also select **See all images** to choose an image from the [Azure Compute Gallery](../virtual-machines/azure-compute-gallery.md).<br /><br />If you chose **Storage blob** for image type, enter the URI of the image. |
   | Virtual machine size | The [Azure virtual machine size](../virtual-machines/sizes.md) used for your session host(s) |
   | Name prefix | The name prefix for your session host(s). Each session host will have a hyphen and then a number added to the end, for example **avd-sh-1**. This name prefix can be a maximum of 11 characters and will also be used as the device name in the operating system. |
   | Number of virtual machines | The number of session hosts you want to deploy at this time. You can add more later. |
   | Link Azure template | Tick the box if you want to [link a separate ARM template](../azure-resource-manager/templates/linked-templates.md) for custom configuration on your session host(s) during deployment. You can specify inline deployment script, desired state configuration, and custom script extension. Provisioning other Azure resources in the template isn't supported.<br /><br />Untick the box if you don't want to link a separate ARM template during deployment. |
   | ARM template file URL | The URL of the ARM template file you want to use. This could be stored in a storage account. |
   | ARM template parameter file URL | The URL of the ARM template parameter file you want to use. This could be stored in a storage account. |

1. On the **Assignments** tab, complete the following information, then select **Next: Review + create >**:

   | Parameter | Value/Description |
   |--|--|
   | Create test user account | Tick the box if you want a new user account created during deployment for testing purposes. |
   | Test user name | The user principal name (UPN) of the test account you want to be created, for example `testuser@contoso.com`. This user will be created in your Microsoft Entra tenant, synchronized to Microsoft Entra Domain Services, and made a member of the **AVDValidationUsers** security group that is also created during deployment. It must contain a valid UPN suffix for your domain that is also [added as a verified custom domain name in Microsoft Entra ID](../active-directory/fundamentals/add-custom-domain.md).<br /><br />Make sure this user name meets the requirements noted in the [prerequisites](#prerequisites). |
   | Test password | The password to be used for the test account. |
   | Confirm password | Confirmation of the password to be used for the test account. |
   | Assign existing users or groups | You can select existing users or groups by ticking the box and selecting **Add Microsoft Entra users or user groups**. Select Microsoft Entra users or user groups, then select **Select**. These users and groups must be in the synchronization scope configured for Microsoft Entra Domain Services. Admin accounts aren’t able to sign in to the virtual desktop. |

1. On the **Review + create** tab, ensure validation passes and review the information that will be used during deployment.

1. Select **Create**.

---

## Connect to the desktop

Once the deployment has completed successfully, if you created a test account or assigned an existing user during deployment, you can connect to it following the steps for one of the supported Remote Desktop clients. For example, you can follow the steps to [Connect with the Windows Desktop client](users/connect-windows.md).

If you didn't create a test account or assigned an existing user during deployment, you'll need to add users to the **AVDValidationUsers** security group before you can connect.

## Resources that will be deployed

# [New Microsoft Entra Domain Services](#tab/new-aadds)

| Resource type | Name | Resource group name | Notes |
|--|--|--|--|
| Resource group | *your prefix*-avd | N/A | This is a predefined name. |
| Resource group | *your prefix*-deployment | N/A | This is a predefined name. |
| Resource group | *your prefix*-prerequisite | N/A | This is a predefined name. |
| Microsoft Entra Domain Services | *your domain name* | *your prefix*-prerequisite | Deployed with the [Enterprise SKU](https://azure.microsoft.com/pricing/details/active-directory-ds/#pricing). You can [change the SKU](../active-directory-domain-services/change-sku.md) after deployment. |
| Automation Account | ebautomation*random string* | *your prefix*-deployment | This is a predefined name. |
| Automation Account runbook | inputValidationRunbook(*Automation Account name*) | *your prefix*-deployment | This is a predefined name. |
| Automation Account runbook | prerequisiteSetupCompletionRunbook(*Automation Account name*) | *your prefix*-deployment | This is a predefined name. |
| Automation Account runbook | resourceSetupRunbook(*Automation Account name*) | *your prefix*-deployment | This is a predefined name. |
| Automation Account runbook | roleAssignmentRunbook(*Automation Account name*) | *your prefix*-deployment | This is a predefined name. |
| Managed Identity | easy-button-fslogix-identity | *your prefix*-avd | Only created if **Multiple users** is selected for **Users per virtual machine**. This is a predefined name. |
| Host pool | EB-AVD-HP | *your prefix*-avd | This is a predefined name. |
| Application group | EB-AVD-HP-DAG | *your prefix*-avd | This is a predefined name. |
| Workspace | EB-AVD-WS | *your prefix*-avd | This is a predefined name. |
| Storage account | eb*random string* | *your prefix*-avd | This is a predefined name. |
| Virtual machine | *your prefix*-*number* | *your prefix*-avd | This is a predefined name. |
| Virtual network | avdVnet | *your prefix*-prerequisite | The address space used is **10.0.0.0/16**. The address space and name are predefined. |
| Network interface | *virtual machine name*-nic | *your prefix*-avd | This is a predefined name. |
| Network interface | aadds-*random string*-nic | *your prefix*-prerequisite | This is a predefined name. |
| Network interface | aadds-*random string*-nic | *your prefix*-prerequisite | This is a predefined name. |
| Disk | *virtual machine name*\_OsDisk_1_*random string* | *your prefix*-avd | This is a predefined name. |
| Load balancer | aadds-*random string*-lb | *your prefix*-prerequisite | This is a predefined name. |
| Public IP address | aadds-*random string*-pip | *your prefix*-prerequisite | This is a predefined name. |
| Network security group | avdVnet-nsg | *your prefix*-prerequisite | This is a predefined name. |
| Group | AVDValidationUsers | N/A | Created in your new Microsoft Entra tenant and synchronized to Microsoft Entra Domain Services. It contains a new test user (if created) and users you selected. This is a predefined name. |
| User | *your test user* | N/A | If you select to create a test user, it will be created in your new Microsoft Entra tenant, synchronized to Microsoft Entra Domain Services, and made a member of the *AVDValidationUsers* security group. |

# [Existing AD DS](#tab/existing-adds)

| Resource type | Name | Resource group name | Notes |
|--|--|--|--|
| Resource group | *your prefix*-avd | N/A | This is a predefined name. |
| Resource group | *your prefix*-deployment | N/A | This is a predefined name. |
| Automation Account | ebautomation*random string* | *your prefix*-deployment | This is a predefined name. |
| Automation Account runbook | inputValidationRunbook(*Automation Account name*) | *your prefix*-deployment | This is a predefined name. |
| Automation Account runbook | prerequisiteSetupCompletionRunbook(*Automation Account name*) | *your prefix*-deployment | This is a predefined name. |
| Automation Account runbook | resourceSetupRunbook(*Automation Account name*) | *your prefix*-deployment | This is a predefined name. |
| Automation Account runbook | roleAssignmentRunbook(*Automation Account name*) | *your prefix*-deployment | This is a predefined name. |
| Managed Identity | easy-button-fslogix-identity | *your prefix*-avd | Only created if **Multiple users** is selected for **Users per virtual machine**. This is a predefined name. |
| Host pool | EB-AVD-HP | *your prefix*-avd | This is a predefined name. |
| Application group | EB-AVD-HP-DAG | *your prefix*-avd | This is a predefined name. |
| Workspace | EB-AVD-WS | *your prefix*-avd | This is a predefined name. |
| Storage account | eb*random string* | *your prefix*-avd | This is a predefined name. |
| Virtual machine | *your prefix*-*number* | *your prefix*-avd | This is a predefined name. |
| Network interface | *virtual machine name*-nic | *your prefix*-avd | This is a predefined name. |
| Disk | *virtual machine name*\_OsDisk_1_*random string* | *your prefix*-avd | This is a predefined name. |
| Group | AVDValidationUsers | N/A | Created in your AD DS domain and synchronized to Microsoft Entra ID. It contains a new test user (if created) and users you selected. This is a predefined name. |
| User | *your test user* | N/A | If you select to create a test user, it will be created in your AD DS domain, synchronized to Microsoft Entra ID, and made a member of the *AVDValidationUsers* security group. |

# [Existing Microsoft Entra Domain Services](#tab/existing-aadds)

| Resource type | Name | Resource group name | Notes |
|--|--|--|--|
| Resource group | *your prefix*-avd | N/A | This is a predefined name. |
| Resource group | *your prefix*-deployment | N/A | This is a predefined name. |
| Automation Account | ebautomation*random string* | *your prefix*-deployment | This is a predefined name. |
| Automation Account runbook | inputValidationRunbook(*Automation Account name*) | *your prefix*-deployment | This is a predefined name. |
| Automation Account runbook | prerequisiteSetupCompletionRunbook(*Automation Account name*) | *your prefix*-deployment | This is a predefined name. |
| Automation Account runbook | resourceSetupRunbook(*Automation Account name*) | *your prefix*-deployment | This is a predefined name. |
| Automation Account runbook | roleAssignmentRunbook(*Automation Account name*) | *your prefix*-deployment | This is a predefined name. |
| Managed Identity | easy-button-fslogix-identity | *your prefix*-avd | Only created if **Multiple users** is selected for **Users per virtual machine**. This is a predefined name. |
| Host pool | EB-AVD-HP | *your prefix*-avd | This is a predefined name. |
| Application group | EB-AVD-HP-DAG | *your prefix*-avd | This is a predefined name. |
| Workspace | EB-AVD-WS | *your prefix*-avd | This is a predefined name. |
| Storage account | eb*random string* | *your prefix*-avd | This is a predefined name. |
| Virtual machine | *your prefix*-*number* | *your prefix*-avd | This is a predefined name. |
| Network interface | *virtual machine name*-nic | *your prefix*-avd | This is a predefined name. |
| Disk | *virtual machine name*\_OsDisk_1_*random string* | *your prefix*-avd | This is a predefined name. |
| Group | AVDValidationUsers | N/A | Created in your Microsoft Entra tenant and synchronized to Microsoft Entra Domain Services. It contains a new test user (if created) and users you selected. This is a predefined name. |
| User | *your test user* | N/A | If you select to create a test user, it will be created in your Microsoft Entra tenant, synchronized to Microsoft Entra Domain Services, and made a member of the *AVDValidationUsers* security group. |

---

## Clean up resources

If you want to remove Azure Virtual Desktop resources from your environment, you can safely remove them by deleting the resource groups that were deployed. These are:

- *your-prefix*-deployment
- *your-prefix*-avd
- *your-prefix*-prerequisite (only if you deployed the getting started feature with a new Microsoft Entra Domain Services domain)

To delete the resource groups:

1. Sign in to [the Azure portal](https://portal.azure.com).

1. In the search bar, type *Resource groups* and select the matching service entry.

1. Select the name of one of resource groups, then select **Delete resource group**.

1. Review the affected resources, then type the resource group name in the box, and select **Delete**.

1. Repeat these steps for the remaining resource groups.

## Next steps

If you want to publish apps as well as the full virtual desktop, see the tutorial to [Manage application groups with the Azure portal](manage-app-groups.md).

If you'd like to learn how to deploy Azure Virtual Desktop in a more in-depth way, with less permission required, or programmatically, check out our series of tutorials, starting with [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md).
