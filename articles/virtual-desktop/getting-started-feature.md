---
title: Deploy Azure Virtual Desktop with the getting started feature
description: A quickstart guide for how to quickly set up Azure Virtual Desktop with the Azure portal's getting started feature.
author: Heidilohr
ms.topic: quickstart
ms.date: 06/06/2022
ms.author: helohr
manager: femila
ms.custom: mode-portal
---

# Deploy Azure Virtual Desktop with the getting started feature

You can quickly deploy Azure Virtual Desktop with the *getting started* feature in the Azure portal. This can be used in smaller scenarios with a few users and apps, or you can use it to evaluate Azure Virtual Desktop in larger enterprise scenarios. It works with existing Active Directory Domain Services (AD DS) or Azure Active Directory Domain Services (Azure AD DS) deployments, or it can deploy Azure AD DS for you. Once you're finished, a user will be able to sign in a virtual desktop session, consisting of one host pool (with one or more session hosts), one app group, and one user. To learn about the terminology used in Azure Virtual Desktop, see [Azure Virtual Desktop terminology](environment-setup.md).

> [!TIP]
> Enterprises should plan an Azure Virtual Desktop deployment using the resources as part of the Cloud Adoption Framework https://docs.microsoft.com/en-us/azure/architecture/example-scenario/wvd/windows-virtual-desktop?context=%2Fazure%2Fvirtual-desktop%2Fcontext%2Fcontext. You can also find more a granular deployment process in a [series of tutorials](create-host-pools-azure-marketplace.md) that also cover programmatic methods.

You can see the list of resources that will be deployed in the section [resources that will be deployed](#resources-that-will-be-deployed) below.

## Prerequisites

Please review the [Prerequisites for Azure Virtual Desktop](prerequisites.md) to start, however the getting started feature has some different prerequisites you'll need to meet. Select a tab below to show instructions that are most relevant to your environment.

# [New Azure AD DS](#tab/new-aadds)

At a high level, you'll need:

- An Azure account with an active subscription. The getting started feature doesn't currently support accounts with multi-factor authentication, or MSA, B2B, or guest accounts.
- An account with the global administrator Azure AD role assigned on the Azure tenant and the [owner role](../role-based-access-control/built-in-roles.md) on your subscription.
- No existing Azure AD DS domain deployed in your Azure tenant.
- The domain admin user name you choose must not include any keywords [that the username guideline list doesn't allow](../virtual-machines/windows/faq.yml#what-are-the-username-requirements-when-creating-a-vm-), and you must use a unique user name that's not already in your Azure AD subscription.

# [Existing AD DS](#tab/existing-adds)

At a high level, you'll need:

- An Azure account with an active subscription. The getting started feature doesn't currently support accounts with multi-factor authentication, or MSA, B2B, or guest accounts.
- An account with the global administrator Azure AD role assigned on the Azure tenant and the [owner role](../role-based-access-control/built-in-roles.md) on your subscription.
- An AD DS domain controller deployed in Azure in the same subscription as the one you choose to use with the getting started feature. Peered subscriptions aren't supported. Make sure you know the fully qualified domain name (FQDN).
- Domain admin credentials.
- You must configure [Azure AD connect](../active-directory/hybrid/whatis-azure-ad-connect.md) on your subscription and make sure the **Users** container is syncing with Azure AD. A security group called **AVDValidationUsers** will be created during deployment in the *Users* container by default. You can also pre-create the AVDValidationUsers security group in a different organization unit. You must make sure this group is synchronized to Azure AD. 
- A virtual network in the same Azure region you want to deploy Azure Virtual Desktop to. We recommend that you create a new virtual network for Azure Virtual Desktop and use [virtual network peering](../virtual-network/virtual-network-peering-overview.md) to peer it with the virtual network for AD DS or Azure AD DS. You also need to make sure you can resolve your AD DS or Azure AD DS domain name from this new virtual network.
- Internet access is required from your domain controller VM to download PowerShell DSC configuration from `https://wvdportalstorageblob.blob.core.windows.net/galleryartifacts/`.

# [Existing Azure AD DS](#tab/existing-aadds)

At a high level, you'll need:

- An Azure account with an active subscription. The getting started feature doesn't currently support accounts with multi-factor authentication, or MSA, B2B, or guest accounts.
- An account with the global administrator Azure AD role assigned on the Azure tenant and the [owner role](../role-based-access-control/built-in-roles.md) on your subscription.
- Azure AD DS deployed in the same tenant and subscription. Peered subscriptions aren't supported. Make sure you know the fully qualified domain name (FQDN).
- Your domain admin user needs to have the same UPN suffix in Azure AD and Azure AD DS. This means your Azure AD DS name is the same as your .onmicrosoft.com tenant name or you've added the domain name used for Azure AD DS as a verified custom domain name to Azure AD.
- An Azure AD account that is a member of **AAD DC Administrators** group in Azure AD.
- The *forest type* for Azure AD DS must be **User**.
- A virtual network in the same Azure region you want to deploy Azure Virtual Desktop to. We recommend that you create a new virtual network for Azure Virtual Desktop and use [virtual network peering](../virtual-network/virtual-network-peering-overview.md) to peer it with the virtual network for AD DS or Azure AD DS. You also need to make sure this virtual network uses your Azure AD DS DNS server IP addresses to resolve your Azure AD DS domain name from this virtual network for Azure Virtual Desktop.

---

## Deployment steps

# [New Azure AD DS](#tab/new-aadds)

Here's how to deploy Azure Virtual Desktop and a new Azure AD DS domain using the getting started feature:

1. Sign in to [the Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Getting started** to open the landing page for the getting started feature, then select **Start**.

1. On the **Basics** tab, complete the following information, then select **Next: Virtual Machines >**:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | The subscription you want to use from the drop-down list. |
   | Identity provider | No identity provider. |
   | Identity service type | Azure AD Domain Services. |
   | Resource group | Enter a name. This will be used as the prefix for the resource groups that are deployed. |
   | Location | The Azure region where your Azure Virtual Desktop resources will be deployed. |
   | Azure admin user name | The user principal name (UPN) of the account with the global administrator role in Azure AD and the owner role on the subscription that you selected. |
   | Azure admin password | The password for the Azure admin account. The getting started feature doesn't currently support accounts with multi-factor authentication. |
   | Domain admin user name | The user principal name (UPN) for a new Azure AD account that will be added to a new *AAD DC Administrators* group and used to manage your Azure AD DS domain. The UPN suffix will be used as the Azure AD DS domain name. |
   | Domain admin password | The password for the domain admin account. |

1. On the **Virtual machines** tab, complete the following information, then select **Next: Assignments >**:

   | Parameter | Value/Description |
   |--|--|
   | Users per virtual machine | Select **Multiple users** or **One user at a time** depending on whether you want users to share a session host or assign a session host to an individual user. Learn more about [host pool types](environment-setup.md#host-pools). Selecting **Multiple users** will also create an Azure Files storage account joined to the same Azure AD DS domain. |
   | Image type | Select **Gallery** to choose from a predefined list, or **storage blob** to enter a URI to the image. |
   | Image | If you chose **Gallery** for image type: the operating system image you want to use from the drop-down list. You can also select **See all images** to choose an image from the Azure Compute Gallery.<br /><br />If you chose **Storage blob** for image type: enter the URI of the image. |
   | Virtual machine size | The [Azure virtual machine size](../virtual-machines/sizes.md) used for your session host(s) |
   | Name prefix | The name prefix for your session host(s). Each session host will have a hyphen and then a number added to the end, for example **-1**. This name prefix can be a maximum of 11 characters and will also be used as the device name in the operating system. |
   | Number of virtual machines | The number of session hosts you want to deploy at this time. You can add more later. |
   | Link Azure template | Tick the box if you want to link a separate ARM template for custom configuration on your session host(s) during deployment. You can specify inline deployment script, desired state configuration, and custom script extension. Provisioning Azure resources in the template isn't supported.<br /><br />Untick the box if you don't want to link a separate ARM template during deployment. |
   | ARM template file URL | The URL of the ARM template file you want to use. This could be stored in a storage account. |
   | ARM template parameter file URL | The URL of the ARM template parameter file you want to use. This could be stored in a storage account. |

1. On the **Assignments** tab, complete the following information, then select **Next: Review + create >**:

   | Parameter | Value/Description |
   |--|--|
   | Create test user account | Tick the box if you want a new user account created during deployment for testing purposes. |
   | Test user name | The user principal name (UPN) of the test account you want to be created, for example `testuser@contoso.com`. This user will be created in your new Azure AD tenant, synchronized to Azure AD DS, and made a member of the AVDValidationUsers security group. It must contain a valid UPN suffix for your domain that is also added as a verified custom domain name in Azure AD. |
   | Test password | The password to be used for the test account. |
   | Confirm password | Confirmation of the password to be used for the test account. |

1. On the **Review + create** tab, ensure validation passes and review the information that will be used during deployment.

1. Select **Create**.

# [Existing AD DS](#tab/existing-adds)

Here's how to deploy Azure Virtual Desktop using the getting started feature where you already have AD DS available:

> [!NOTE]
> The PowerShell Desired State Configuration (DSC) extension will be added to your domain controller VM. A configuration will be added called **AddADDSUser** that contains PowerShell scripts to create the security group and test user, and to populate the security group with any users you choose to add during deployment.

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
   | Azure admin user name | The user principal name (UPN) of the account with the global administrator role in Azure AD and the owner role on the subscription that you selected. |
   | Azure admin password | The password for the Azure admin account. The getting started feature doesn't currently support accounts with multi-factor authentication. |
   | Domain admin user name | The user principal name (UPN) of the domain admin account in your AD DS domain. The UPN suffix doesn't need to be added as a custom domain in Azure AD. |
   | Domain admin password | The password for the domain admin account. |

1. On the **Virtual machines** tab, complete the following information, then select **Next: Assignments >**:

   | Parameter | Value/Description |
   |--|--|
   | Users per virtual machine | Select **Multiple users** or **One user at a time** depending on whether you want users to share a session host or assign a session host to an individual user. Learn more about [host pool types](environment-setup.md#host-pools). Selecting **Multiple users** will also create an Azure Files storage account joined to the same AD DS domain. |
   | Image type | Select **Gallery** to choose from a predefined list, or **storage blob** to enter a URI to the image. |
   | Image | If you chose **Gallery** for image type: the operating system image you want to use from the drop-down list. You can also select **See all images** to choose an image from the Azure Compute Gallery.<br /><br />If you chose **Storage blob** for image type: enter the URI of the image. |
   | Virtual machine size | The [Azure virtual machine size](../virtual-machines/sizes.md) used for your session host(s). |
   | Name prefix | The name prefix for your session host(s). Each session host will have a hyphen and then a number added to the end, for example **-1**. This name prefix can be a maximum of 11 characters and will also be used as the device name in the operating system. |
   | Number of virtual machines | The number of session hosts you want to deploy at this time. You can add more later. |
   | Specify domain or unit | Select **Yes**:<br /><ul><li>If the FQDN of your domain is different to the UPN suffix of the domain admin user in the previous step.</li><li>If you want to create the computer account in a specific Organizational Unit (OU).</li></ul><br /> If you select *Yes*, you must enter a value for **Domain to join**, even if that is the same as the UPN suffix of the domain admin user in the previous step. Organizational Unit path is optional and if it's left empty, the computer account will be placed in the Users container.<br /><br />Select **No** to use the suffix of the Active Directory domain join UPN as the FQDN. For example, the user `vmjoiner@contoso.com` has a UPN suffix of `contoso.com`. The computer account will be placed in the Users container. |
   | Domain controller resource group | The resource group that contains your domain controller virtual machine from the drop-down list. The resource group must be in the same subscription you selected earlier. |
   | Domain controller virtual machine | Your domain controller virtual machine from the drop-down list. This is required for creating or assigning the initial user and group. |
   | Link Azure template | Tick the box if you want to link a separate ARM template for custom configuration on your session host(s) during deployment. You can specify inline deployment script, desired state configuration, and custom script extension. Provisioning Azure resources in the template isn't supported.<br /><br />Untick the box if you don't want to link a separate ARM template during deployment. |
   | ARM template file URL | The URL of the ARM template file you want to use. This could be stored in a storage account. |
   | ARM template parameter file URL | The URL of the ARM template parameter file you want to use. This could be stored in a storage account. |

1. On the **Assignments** tab, complete the following information, then select **Next: Review + create >**:

   | Parameter | Value/Description |
   |--|--|
   | Create test user account | Tick the box if you want a new user account created during deployment for testing purposes. |
   | Test user name | The user principal name (UPN) of the test account you want to be created, for example `testuser@contoso.com`. This user will be created in your AD DS domain and synchronized to Azure AD. It must contain a valid UPN suffix for your domain that is also added as a verified custom domain name in Azure AD. |
   | Test password | The password to be used for the test account. |
   | Confirm password | Confirmation of the password to be used for the test account. |
   | Assign existing users or groups | You can select existing users or groups by ticking the box and selecting **Add Azure AD users or user groups**. Select Azure AD users or user groups, then select **Select**. These users and groups must be [hybrid identities](../active-directory/hybrid/whatis-hybrid-identity.md), which means the user account is synchronized between your AD DS domain and Azure AD. Admin accounts aren’t able to sign in to the virtual desktop. |

1. On the **Review + create** tab, ensure validation passes and review the information that will be used during deployment.

1. Select **Create**.

# [Existing Azure AD DS](#tab/existing-aadds)

Here's how to deploy Azure Virtual Desktop using the getting started feature where you already have Azure AD DS available:

1. Sign in to [the Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Getting started** to open the landing page for the getting started feature, then select **Start**.

1. On the **Basics** tab, complete the following information, then select **Next: Virtual Machines >**:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | The subscription you want to use from the drop-down list. |
   | Identity provider | Existing Active Directory. |
   | Identity service type | Azure AD Domain Services. |
   | Resource group | Enter a name. This will be used as the prefix for the resource groups that are deployed. |
   | Location | The Azure region where your Azure Virtual Desktop resources will be deployed. |
   | Virtual network | The virtual network in the same Azure region you want to connect your Azure Virtual Desktop resources to. This must have connectivity to your Azure AD DS domain and be able to resolve its FQDN. |
   | Subnet | The subnet of the virtual network you want to connect your Azure Virtual Desktop resources to. |
   | Azure admin user name | The user principal name (UPN) of the account with the global administrator role in Azure AD and the owner role on the subscription that you selected. |
   | Azure admin password | The password for the Azure admin account. The getting started feature doesn't currently support accounts with multi-factor authentication. |
   | Domain admin user name | The user principal name (UPN) of the admin account to manage your Azure AD DS domain. The UPN suffix of the user in Azure AD must match the Azure AD DS domain name. |
   | Domain admin password | The password for the domain admin account. |

1. On the **Virtual machines** tab, complete the following information, then select **Next: Assignments >**:

   | Parameter | Value/Description |
   |--|--|
   | Users per virtual machine | Select **Multiple users** or **One user at a time** depending on whether you want users to share a session host or assign a session host to an individual user. Learn more about [host pool types](environment-setup.md#host-pools). Selecting **Multiple users** will also create an Azure Files storage account joined to the same Azure AD DS domain. |
   | Image type | Select **Gallery** to choose from a predefined list, or **storage blob** to enter a URI to the image. |
   | Image | If you chose **Gallery** for image type: the operating system image you want to use from the drop-down list. You can also select **See all images** to choose an image from the Azure Compute Gallery.<br /><br />If you chose **Storage blob** for image type: enter the URI of the image. |
   | Virtual machine size | The [Azure virtual machine size](../virtual-machines/sizes.md) used for your session host(s) |
   | Name prefix | The name prefix for your session host(s). Each session host will have a hyphen and then a number added to the end, for example **-1**. This name prefix can be a maximum of 11 characters and will also be used as the device name in the operating system. |
   | Number of virtual machines | The number of session hosts you want to deploy at this time. You can add more later. |
   | Link Azure template | Tick the box if you want to link a separate ARM template for custom configuration on your session host(s) during deployment. You can specify inline deployment script, desired state configuration, and custom script extension. Provisioning Azure resources in the template isn't supported.<br /><br />Untick the box if you don't want to link a separate ARM template during deployment. |
   | ARM template file URL | The URL of the ARM template file you want to use. This could be stored in a storage account. |
   | ARM template parameter file URL | The URL of the ARM template parameter file you want to use. This could be stored in a storage account. |

1. On the **Assignments** tab, complete the following information, then select **Next: Review + create >**:

   | Parameter | Value/Description |
   |--|--|
   | Create test user account | Tick the box if you want a new user account created during deployment for testing purposes. |
   | Test user name | The user principal name (UPN) of the test account you want to be created, for example `testuser@contoso.com`. This user will be created in your Azure AD tenant, synchronized to Azure AD DS, and made a member of the AVDValidationUsers security group. It must contain a valid UPN suffix for your domain that is also added as a verified custom domain name in Azure AD. |
   | Test password | The password to be used for the test account. |
   | Confirm password | Confirmation of the password to be used for the test account. |
   | Assign existing users or groups | You can select existing users or groups by ticking the box and selecting **Add Azure AD users or user groups**. Select Azure AD users or user groups, then select **Select**. These users and groups must be in the synchronization scope configured for Azure AD DS. Admin accounts aren’t able to sign in to the virtual desktop. |

1. On the **Review + create** tab, ensure validation passes and review the information that will be used during deployment.

1. Select **Create**.

---

## Connect to the desktop

Once the deployment has completed successfully, if you created a test account or assigned an existing user during deployment, you can connect to it following the steps for one of the supported Remote Desktop clients. For example, you can follow the steps to [Connect with the Windows Desktop client](user-documentation/connect-windows-7-10.md).

If you didn't create a test account or assigned an existing user during deployment, you'll need to add users to the **AVDValidationUsers** security group before you can connect.

## Appendix: Resources that will be deployed

# [New Azure AD DS](#tab/new-aadds)

| Resource type | Name | Resource group name | Notes |
|--|--|--|--|
| Resource group | *your prefix*-avd | N/A |  |
| Resource group | *your prefix*-deployment | N/A |  |
| Resource group | *your prefix*-prerequisite | N/A |  |
| Azure AD DS | *your domain name* | *your prefix*-prerequisite | Deployed with the [Enterprise SKU](https://azure.microsoft.com/pricing/details/active-directory-ds/#pricing). You can [change the SKU](../active-directory-domain-services/change-sku.md) after deployment. |
| Automation Account | ebautomation*random string* | *your prefix*-deployment |  |
| Automation Account runbook | inputValidationRunbook(*Automation Account name*) | *your prefix*-deployment |  |  |
| Automation Account runbook | prerequisiteSetupCompletionRunbook(*Automation Account name*) | *your prefix*-deployment |  |
| Automation Account runbook | resourceSetupRunbook(*Automation Account name*) | *your prefix*-deployment |  |
| Automation Account runbook | roleAssignmentRunbook(*Automation Account name*) | *your prefix*-deployment |  |
| Managed Identity | easy-button-fslogix-identity | *your prefix*-avd | Note: only created if **Multiple users** is selected for **Users per virtual machine** |
| Host pool | EB-AVD-HP | *your prefix*-avd |  |
| Application group | EB-AVD-HP-DAG | *your prefix*-avd |  |
| Workspace | EB-AVD-WS | *your prefix*-avd |  |
| Storage account | eb*random string* | *your prefix*-avd |  |
| Virtual machine | *your prefix*-*number* | *your prefix*-avd |  |
| Virtual network | avdVnet | *your prefix*-prerequisite | 10.0.0.0/16 |
| Network interface | *virtual machine name*-nic | *your prefix*-avd |  |
| Network interface | aadds-*random string*-nic | *your prefix*-prerequisite |  |
| Network interface | aadds-*random string*-nic | *your prefix*-prerequisite |  |
| Disk | *virtual machine name*\_OsDisk_1_*random string* | *your prefix*-avd |  |
| Load balancer | aadds-*random string*-lb | *your prefix*-prerequisite |  |
| Public IP address | aadds-*random string*-pip | *your prefix*-prerequisite |  |
| Network security group | avdVnet-nsg | *your prefix*-prerequisite |  |
| Group | AVDValidationUsers | N/A | Created in your new Azure AD tenant and synchronized to Azure AD DS. It contains a new test user (if created) and users you selected. |
| User | *your test user* | N/A | If you select to create a test user, it will be created in your new Azure AD tenant, synchronized to Azure AD DS, and made a member of the *AVDValidationUsers* security group. |

# [Existing AD DS](#tab/existing-adds)

| Resource type | Name | Resource group name | Notes |
|--|--|--|--|
| Resource group | *your prefix*-avd | N/A |  |
| Resource group | *your prefix*-deployment | N/A |  |
| Automation Account | ebautomation*random string* | *your prefix*-deployment |  |
| Automation Account runbook | inputValidationRunbook(*Automation Account name*) | *your prefix*-deployment |  |  |
| Automation Account runbook | prerequisiteSetupCompletionRunbook(*Automation Account name*) | *your prefix*-deployment |  |
| Automation Account runbook | resourceSetupRunbook(*Automation Account name*) | *your prefix*-deployment |  |
| Automation Account runbook | roleAssignmentRunbook(*Automation Account name*) | *your prefix*-deployment |  |
| Managed Identity | easy-button-fslogix-identity | *your prefix*-avd | Note: only created if **Multiple users** is selected for **Users per virtual machine** |
| Host pool | EB-AVD-HP | *your prefix*-avd |  |
| Application group | EB-AVD-HP-DAG | *your prefix*-avd |  |
| Workspace | EB-AVD-WS | *your prefix*-avd |  |
| Storage account | eb*random string* | *your prefix*-avd |  |
| Virtual machine | *your prefix*-*number* | *your prefix*-avd |  |
| Network interface | *virtual machine name*-nic | *your prefix*-avd |  |
| Disk | *virtual machine name*\_OsDisk_1_*random string* | *your prefix*-avd |  |
| Group | AVDValidationUsers | N/A | Created in your AD DS domain and synchronized to Azure AD. It contains a new test user (if created) and users you selected. |
| User | *your test user* | N/A | If you select to create a test user, it will be created in your AD DS domain, synchronized to Azure AD, and made a member of the *AVDValidationUsers* security group. |

# [Existing Azure AD DS](#tab/existing-aadds)

| Resource type | Name | Resource group name | Notes |
|--|--|--|--|
| Resource group | *your prefix*-avd | N/A |  |
| Resource group | *your prefix*-deployment | N/A |  |
| Automation Account | ebautomation*random string* | *your prefix*-deployment |  |
| Automation Account runbook | inputValidationRunbook(*Automation Account name*) | *your prefix*-deployment |  |  |
| Automation Account runbook | prerequisiteSetupCompletionRunbook(*Automation Account name*) | *your prefix*-deployment |  |
| Automation Account runbook | resourceSetupRunbook(*Automation Account name*) | *your prefix*-deployment |  |
| Automation Account runbook | roleAssignmentRunbook(*Automation Account name*) | *your prefix*-deployment |  |
| Managed Identity | easy-button-fslogix-identity | *your prefix*-avd | Note: only created if **Multiple users** is selected for **Users per virtual machine** |
| Host pool | EB-AVD-HP | *your prefix*-avd |  |
| Application group | EB-AVD-HP-DAG | *your prefix*-avd |  |
| Workspace | EB-AVD-WS | *your prefix*-avd |  |
| Storage account | eb*random string* | *your prefix*-avd |  |
| Virtual machine | *your prefix*-*number* | *your prefix*-avd |  |
| Network interface | *virtual machine name*-nic | *your prefix*-avd |  |
| Disk | *virtual machine name*\_OsDisk_1_*random string* | *your prefix*-avd |  |
| Group | AVDValidationUsers | N/A | Created in your Azure AD tenant and synchronized to Azure AD DS. It contains a new test user (if created) and users you selected. |
| User | *your test user* | N/A | If you select to create a test user, it will be created in your Azure AD tenant, synchronized to Azure AD DS, and made a member of the *AVDValidationUsers* security group. |

---

## Clean up resources

If you change your mind and want to remove Azure Virtual Desktop resources from your environment without incurring extra billing costs, you can safely remove them by following the instructions in this section.

If you created your resources in a subscription with Azure AD DS or AD DS, the feature will have made two resource groups with the names *your-prefix*-deployment* and *your-prefix*-avd. In the Azure portal, go to **Resource groups** and delete any resource groups with those prefixes to remove the deployment.

If you created your resources in a subscription without Azure AD DS or AD DS, the feature will have made three resource groups with the names *your-prefix*-deployment* and *your-prefix*-avd, and *your-prefix*-prerequisite. In the Azure portal, go to **Resource groups** and delete any resource groups with those prefixes to remove the deployment.

> [!TIP]
> If you want to deploy Azure Virtual Desktop again using the getting started feature without deleting the resources, ensure you use different names for the resource group prefix, virtual machine name prefix, and test user (if required). If you deployed Azure AD DS with the getting started features, you can only have one instance per Azure AD tenant and you'll need to use the existing domain.

## Next steps

If you'd like to learn how to deploy Azure Virtual Desktop in a more in-depth way, with fewer permissions required, or programmatically, check out our series of tutorials, starting with [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md).
