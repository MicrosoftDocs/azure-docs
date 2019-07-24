---
title: Deploy management tool - Azure
description: How to install a user interface tool to manage Windows Virtual Desktop preview resources.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 06/04/2019
ms.author: v-chjenk
---
# Tutorial: Deploy a management tool

The management tool provides a user interface (UI) for managing Microsoft Virtual Desktop Preview resources. In this tutorial, you'll learn how to deploy and connect to the management tool.

>[!NOTE]
>These instructions are for a Windows Virtual Desktop Preview-specific configuration that can be used with your organization's existing processes.

## Important considerations

Since the app requires consent to interact with Windows Virtual Desktop, this tool doesn't support Business-to-Business (B2B) scenarios. Each Azure Active Directory (AAD) tenant's subscription will need its own separate deployment of the management tool.

This management tool is a sample. Microsoft will provide important security and quality updates. The [source code is available in GitHub](https://github.com/Azure/RDS-Templates/tree/master/wvd-templates/wvd-management-ux/deploy). Customers and partners are encouraged to customize the tool to fit their business needs.

## What you need to run the Azure Resource Manager template

Before deploying the Azure Resource Manager template, you'll need an Azure Active Directory user to deploy the management UI. This user must:

- Have Azure Multi-Factor Authentication (MFA) disabled
- Have permission to create resources in your Azure subscription
- Have permission to create an Azure AD application. Follow these steps to check if your user has the [required permissions](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#required-permissions).

After deploying the Azure Resource Manager template, you'll want to launch the management UI to validate. This user must:
- Have a role assignment to view or edit your Windows Virtual Desktop tenant

## Run the Azure Resource Manager template to provision the management UI

Before you start, ensure the server and client apps have consent by visiting the [Windows Virtual Desktop Consent Page](https://rdweb.wvd.microsoft.com) for the Azure Active Directory (AAD) represented.

Follow these instructions to deploy the Azure Resource Management template:

1. Go to the [GitHub Azure RDS-Templates page](https://github.com/Azure/RDS-Templates/tree/master/wvd-templates/wvd-management-ux/deploy).
2. Deploy the template to Azure.
    - If you're deploying in an Enterprise subscription, scroll down and select **Deploy to Azure**. See [Guidance for template parameters](#guidance-for-template-parameters).
    - If you're deploying in a Cloud Solution Provider subscription, follow these instructions to deploy to Azure:
        1. Scroll down and right-click **Deploy to Azure**, then select **Copy Link Location**.
        2. Open a text editor like Notepad and paste the link there.
        3. Right after <https://portal.azure.com/> and before the hashtag (#), enter an at sign (@) followed by the tenant domain name. Here's an example of the format: <https://portal.azure.com/@Contoso.onmicrosoft.com#create/>.
        4. Sign in to the Azure portal as a user with Admin/Contributor permissions to the Cloud Solution Provider subscription.
        5. Paste the link you copied to the text editor into the address bar.

### Guidance for template parameters
Here's how to enter parameters for configuring the tool:

- This is the RD broker URL:  https:\//rdbroker.wvd.microsoft.com/
- This is the resource URL:  https:\//mrs-prod.ame.gbl/mrs-RDInfra-prod
- Use your AAD credentials with MFA disabled to sign in to Azure. See [What you need to run the Azure Resource Manager template](#what-you-need-to-run-the-azure-resource-manager-template).
- Use a unique name for the application that will be registered in your Azure Active Directory for the management tool; for example, Apr3UX.

## Provide consent for the management tool

After the GitHub Azure Resource Manager template completes, you'll find a resource group containing two app services along with one app service plan in the Azure portal.

Before you sign in and use the management tool, you'll need to provide consent for the new Azure Active Directory application that is associated with the management tool. By providing consent, you are allowing the management tool to make Windows Virtual Desktop management calls on behalf of the user who's signed into the tool.

![A screenshot showing the permissions being provided when you consent to the UI management tool.](media/management-ui-delegated-permissions.png)

To determine which user you can use to sign in to the tool, go to your [Azure Active Directory user settings page](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/UserSettings/menuId/) and take note of the value for **Users can consent to apps accessing company data on their behalf**.

![A screenshot showing if users can grant consent to applications for just their user.](media/management-ui-user-consent-allowed.png)

- If the value is set to **Yes**, you can sign in with any user account in the Azure Active Directory and provide consent for that user only. However, if you sign in to the management tool with a different user later, you must perform the same consent again.
- If the value is set to **No**, you must sign in as a Global Administrator in the Azure Active Directory and provide admin consent for all users in the directory. No other users will face a consent prompt.


Once you decide which user you will use to provide consent, follow these instructions to provide consent to the tool:

1. Go to your Azure resources, select the Azure App Services resource with the name you provided in the template (for example, Apr3UX) and navigate to the URL associated with it; for example,  <https://rdmimgmtweb-210520190304.azurewebsites.net>.
2. Sign in using the appropriate Azure Active Directory user account.
3. If you authenticated with a Global Administrator, you can now select the checkbox to **Consent on behalf of your organization**. Select **Accept** to provide consent.
   
   ![A screenshot showing the full consent page that the user or admin will see.](media/management-ui-consent-page.png)

This will now take you to the management tool.

## Use the management tool

After providing consent for the organization or for a specified user, you can access the management tool at any time.

Follow these instructions to launch the tool:

1. Select the Azure App Services resource with the name you provided in the template (for example, Apr3UX) and navigate to the URL associated with it; for example,  <https://rdmimgmtweb-210520190304.azurewebsites.net>.
2. Sign in using your Windows Virtual Desktop credentials.
3. When prompted to choose a Tenant Group, select **Default Tenant Group** from the drop-down list.

> [!NOTE]
> If you have a custom Tenant Group, enter the name manually instead of choosing from the drop-down list.

## Next steps

Now that you've learned how to deploy and connect to the management tool, you can learn how to use Azure Service Health to monitor service issues and health advisories.

> [!div class="nextstepaction"]
> [Set up service alerts tutorial](./set-up-service-alerts.md)
