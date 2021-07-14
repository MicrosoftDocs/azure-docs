---
title: Deploy Azure Virtual Desktop getting started feature - Azure
description: A quickstart guide for how to quickly set up Azure Virtual Desktop with the Azure portal's getting started feature.
author: Heidilohr
ms.topic: quickstart
ms.date: 07/14/2021
ms.author: helohr
manager: femila
---

# Deploy Azure Virtual Desktop with the getting started feature

The Azure portal's new getting started feature is a quick, easy way to install and configure Azure Virtual Desktop on your deployment.

## Requirements

You'll need the following things to use getting started:

- An Azure Active Directory (AD) tenant
- An account with global admin permissions on Azure AD

   >[!NOTE]
   >The getting started feature doesn't currently support MSA, B2B, or guest accounts at this time.

- An active Azure subscription

   >[!NOTE]
   >The getting started feature doesn't currently support accounts with multi-factor authentication.

- An account with **Owner permissions** on the subscription

If you're using the getting started feature in an environment with Active Directory Domain Services (AD DS), you'll also need to meet these requirements:

- AD DS domain admin credentials
- You must configure Azure AD connect on your subscription and make sure the "USERS" container is syncing with Azure AD
- The domain controller in your virtual machine (VM) must not have DSC extensions of type **Microsoft.Powershell.DSC**

If you're using the getting started feature in an environment without an identity provider, these are the extra requirements you should follow:

- Your AD domain join UPN must not include any keywords [that the username guideline list doesn't allow](../virtual-machines/windows/faq.yml#what-are-the-username-requirements-when-creating-a-vm-), and you must use a unique user name that's not already in your Azure AD subscription.
- You must create a new host pool to add session hosts you create with the getting started feature. If you try to make a session host in an existing host pool, it won't work.

## For subscriptions with Azure AD DS or AD DS

Here's how to use the getting started feature in a subscription that already has Azure AD DS or AD DS:

1. Open [the Azure portal](https://portal.azure.com).

2. Sign in to Azure and open **Azure Virtual Desktop management**, then select the **Getting started** tab. This will open the landing page for the getting started feature.

3. Select **Create**.

4. In the **Basic** tab, select the following values:

    - For **Subscription**, go to **How is your subscription configured**, then select **Existing setup**.

    - In the **Location**, select the location where you'll deploy your resources.

    - For **Azure admin UPN**, enter the full user principal name (UPN) of the account with admin permissions in Azure AD and owner permissions in the subscription that you plan to use.

    - For **AD Domain join UPN** enter the full UPN of the account with permissions that you plan to use to join the VMs to your domain.

    - For **Identity**, select either **Azure AD DS** or **AD DS** depending on your environment. What you choose here will affect the input your VMs will need.

5. In the **Virtual machines** tab, select the following values:

    - For **Do you want the users to share this machine?**, select one of the following options depending on your needs:
      - If you want to create a single-session or personal host pool, select **No**.
      - If you want to create a multi-session or pooled host pool, select **Yes (multi-session)**. This will also create an Azure Files storage account  joined to either Azure AD DS or AD DS.

    - For **Image type**, select an image from the Azure image gallery, a custom image, or a VHD from a storage blob.

    - For **VM size**, select the size and SKU you want for the VMs you'll deploy.

    - For **Number of VMs**, select how many VMs you want to provision in the host pool.

    - If you're using an existing setup with AD DS, these options will appear:

       - For **Subnet**, select a subnet in the VNET. The subnet you choose must either be in the same location as the identity (AD DS or Azure AD DS) or peered to it.

       - For **Domain controller resource group**, select the resource group where the AD DS VM is either located or peered to. The resource group with the domain controller must be in the same subscription. The get started feature doesn't currently support peered subscriptions at this time.

       - For **Domain controller virtual machine**, enter the name of the VM running your deployment's AD DS.

    - If you want to open the Select Azure AD users or Users group, select the **Assign existing users** check box.

    - If you want to create a validation user account to test your deployment, select the **Create validation user** check box, then enter a username and password in the prompt that appears.

       >[!NOTE]
       >Getting started will create the validation user group in the "USERS" container. You must make sure your validation group is synced to Azure AD. If the sync doesn't work, then pre-create the AVDValidationUsers group in an organization unit that is being synced to Azure AD.

## For subscriptions without Azure AD DS or AD DS

This section will show you how to use the getting started feature for a subscription without Azure AD DS or AD DS. For reference, these subscriptions are sometimes called "empty" subscriptions.

To deploy Azure Virtual Desktop on a subscription without Azure AD DS or AD DS:

1. Open [the Azure portal](https://portal.azure.com).

2. Sign in to Azure and open **Azure Virtual Desktop management**, then select the **Getting started** tab. This will open the landing page for the getting started feature.

3. In the **Basic** tab, select the following values:

    - For **Subscription**, select the subscription you want to deploy Azure Virtual Desktop in.

    - For **How is your subscription configured**, select **Empty subscription**. An "empty" subscription is a subscription that doesn't require an identity provider like Azure AD or AD DS.

    - For **Resource group prefix**, enter the prefixes for the resource group you're going to create: *-prerequisite*, *-deployment*, and *-avd*.

    - In **Location**, enter the resource location you want to use for your deployment.

    - For **Azure admin UPN**, enter the full UPN of an account with admin permissions on Azure AD and owner permissions on the subscription.

    - For **AD Domain join UPN**, enter the full UPN for an account that will be added to **AAD DC Administrators** group.

    >[!NOTE]
    >The user name for AD Domain join UPN should be a unique one that doesn't already exist in Azure AD. The getting started feature doesn't currently support using existing Azure AD user names for accounts without Azure AD or AD DS.

4. In the **Virtual machines** tab, select the following values:

    - For **Do you want the users to share this machine?**, select one of the following options depending on your needs:
      - If you want to create a single-session or personal host pool, select **No**.
      - If you want to create a multi-session or pooled host pool, select **Yes (multi-session)**. This will also create an Azure Files storage account  joined to either Azure AD DS or AD DS.

    - For **Image type**, select an image from the Azure image gallery, a custom image, or a VHD from a storage blob.

    - For **VM size**, select the size and SKU you want for the VMs you'll deploy.

    - For **Number of VMs**, select how many VMs you want to provision in the host pool.

5. In the **Assignments** tab, select the **Create validation user**, then enter a username and password into the **Validation user username** and **Validation user password** fields. The validation user is a user who'll test your deployment once it's ready.

## Clean up resources

If after deployment you change your mind and want to remove Azure Virtual Desktop resources from your environment without incurring extra billing costs, you can safely remove them by following the instructions in this section.

If you created your resources on a subscription with Azure AD DS or AD DS, the feature will have made two resource groups with the prefixes "*-deployment*" and "*-avd*." In the Azure portal, go to **Resource groups** and delete any resource groups with those prefixes to remove the deployment.

If you created your resources on a subscription without Azure AD DS or AD DS, the feature will have made three resource groups with the prefixes *-prerequisite*, *-deployment*, and *-avd*. In the Azure portal, go to **Resource groups** and delete any resource groups with those prefixes to remove the deployment.

## Next steps

If you'd like to learn how to deploy Azure Virtual Desktop in a more in-depth way, check out our tutorials for setting up your deployment manually, starting with [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md).