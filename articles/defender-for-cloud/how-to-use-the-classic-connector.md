---
title: Manage the classic connectors
titleSuffix: Defender for Cloud
description: Learn how to remove the AWS and GCP classic connectors from your subscription.
ms.topic: how-to
ms.date: 06/29/2023
---

# Classic connector (retired)

The retired **Classic cloud connector** - Requires configuration in your GCP project or AWS account to create a user that Defender for Cloud can use to connect to your GCP project or AWS environment. The classic connector is only available to customers who have previously connected GCP projects or AWS environments with it.

To connect a [GCP project](quickstart-onboard-gcp.md) or [AWS account](quickstart-onboard-aws.md), you should do so using the native connector available in Defender for Cloud.

## Connect your AWS account using the classic connector

To connect your AWS account using the classic connector:

### Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- Access to an AWS account.

- **Required roles and permissions**: **Owner** on the relevant Azure subscription. A **Contributor** can also connect an AWS account if an owner provides the service principal details.

### Set up AWS Security Hub

To view security recommendations for multiple regions, repeat the following steps for each relevant region.

> [!IMPORTANT]
> If you're using an AWS management account, repeat the following three steps to configure the management account and all connected member accounts across all relevant regions

1. Enable [AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/gs-console.html).

1. Enable [AWS Security Hub](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-settingup.html).

1. Verify that data is flowing to the Security Hub. When you first enable Security Hub, it might take several hours for data to be available.

### Set up authentication for Defender for Cloud in AWS

There are two ways to allow Defender for Cloud to authenticate to AWS:

- [**Create an IAM role for Defender for Cloud** (Recommended)](#create-an-iam-role-for-defender-for-cloud) - The most secure method.
- [**Create an AWS user for Defender for Cloud**](#create-an-aws-user-for-defender-for-cloud) - A less secure option if you don't have IAM enabled.

### Create an IAM role for Defender for Cloud

1. From your Amazon Web Services console, under **Security, Identity & Compliance**, select **IAM**.

    :::image type="content" source="./media/quickstart-onboard-aws/aws-identity-and-compliance.png" alt-text="Screenshot of the AWS services."  lightbox="./media/quickstart-onboard-aws/aws-identity-and-compliance.png":::

1. Select **Roles** and **Create role**.

1. Select **Another AWS account**.

1. Enter the following details:

    - **Account ID** - enter the Microsoft Account ID (**158177204117**) as shown in the AWS connector page in Defender for Cloud.
    - **Require External ID** - should be selected
    - **External ID** - enter the subscription ID as shown in the AWS connector page in Defender for Cloud.

1. Select **Next**.

1. In the **Attach permission policies** section, select the following [AWS managed policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html):

    - SecurityAudit (`arn:aws:iam::aws:policy/SecurityAudit`)
    - AmazonSSMAutomationRole (`arn:aws:iam::aws:policy/service-role/AmazonSSMAutomationRole`)
    - AWSSecurityHubReadOnlyAccess (`arn:aws:iam::aws:policy/AWSSecurityHubReadOnlyAccess`)

1. Optionally add tags. Adding Tags to the user doesn't affect the connection.

1. Select **Next**.

1. In The Roles list, choose the role you created

1. Save the Amazon Resource Name (ARN) for later.

### Create an AWS user for Defender for Cloud

1. Open the **Users** tab and select **Add user**.

1. In the **Details** step, enter a username for Defender for Cloud and ensure that you select **Programmatic access** for the AWS Access Type.

1. Select **Next Permissions**.

1. Select **Attach existing policies directly** and apply the following policies:
    - SecurityAudit
    - AmazonSSMAutomationRole
    - AWSSecurityHubReadOnlyAccess

1. Select **Next: Tags**. Optionally add tags. Adding Tags to the user doesn't affect the connection.

1. Select **Review**.

1. Save the automatically generated **Access key ID** and **Secret access key** CSV file for later.

1. Review the summary and select **Create user**.

### Configure the SSM Agent

AWS Systems Manager is required for automating tasks across your AWS resources. If your EC2 instances don't have the SSM Agent, follow the relevant instructions from Amazon:

- [Installing and Configuring SSM Agent on Windows Instances](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-ssm-win.html)

- [Installing and Configuring SSM Agent on Amazon EC2 Linux Instances](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-ssm-agent.html)

### Complete the Azure Arc prerequisites

1. Make sure the appropriate [Azure resources providers](../azure-arc/servers/prerequisites.md#azure-resource-providers) are registered:
    - Microsoft.HybridCompute
    - Microsoft.GuestConfiguration

1. Create a Service Principal for onboarding at scale. As an **Owner** on the subscription you want to use for the onboarding, create a service principal for Azure Arc onboarding as described in [Create a Service Principal for onboarding at scale](../azure-arc/servers/onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale).

### Connect AWS to Defender for Cloud

1. From Defender for Cloud's menu, open **Environment settings** and select the option to switch back to the classic connectors experience.

    :::image type="content" source="media/quickstart-onboard-gcp/classic-connectors-experience.png" alt-text="Screenshot that shows how to switch back to the classic cloud connectors experience in Defender for Cloud." lightbox="media/quickstart-onboard-gcp/classic-connectors-experience.png":::

1. Select **Add AWS account**.

    :::image type="content" source="./media/quickstart-onboard-aws/add-aws-account.png" alt-text="Screenshot that shows how to add AWS account button on Defender for Cloud's multicloud connectors page." lightbox="./media/quickstart-onboard-aws/add-aws-account.png":::

1. Configure the options in the **AWS authentication** tab:

    1. Enter a **Display name** for the connector.
    
    1. Confirm that the subscription is correct. It's the subscription that includes the connector and AWS Security Hub recommendations.
    
    1. Depending on the authentication option, you chose in [Set up authentication for Defender for Cloud in AWS](#set-up-authentication-for-defender-for-cloud-in-aws):
        - Select  **Assume Role** and paste the ARN from [Create an IAM role for Defender for Cloud](#create-an-iam-role-for-defender-for-cloud).

            :::image type="content" source="./media/quickstart-onboard-aws/paste-arn-in-portal.png" alt-text="Screenshot that shows how to paste the ARN file in the relevant field of the AWS connection wizard in the Azure portal." lightbox="./media/quickstart-onboard-aws/paste-arn-in-portal.png":::

            OR

        - Select **Credentials** and paste the **access key** and **secret key** from the .csv file you saved in [Create an AWS user for Defender for Cloud](#create-an-aws-user-for-defender-for-cloud).
        
1. Select **Next**.

1. Configure the options in the **Azure Arc Configuration** tab:

    Defender for Cloud discovers the EC2 instances in the connected AWS account and uses SSM to onboard them to Azure Arc.

    > [!TIP]
    > See [What operating systems for my EC2 instances are supported?](faq-general.yml)

    1. Select the **Resource Group** and **Azure Region** that the discovered AWS EC2s is onboarded to in the selected subscription.
    
    1. Enter the **Service Principal ID** and **Service Principal Client Secret** for Azure Arc as described here [Create a Service Principal for onboarding at scale](../azure-arc/servers/onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale).
    
    1. If the machine is connecting to the internet via a proxy server, specify the proxy server IP address, or the name and port number that the machine uses to communicate with the proxy server. Enter the value in the format ```http://<proxyURL>:<proxyport>```
    
    1. Select **Review + create**.

        Review the summary information

        The Tags sections list all Azure Tags that are automatically created for each onboarded EC2 with its own relevant details to easily recognize it in Azure. 

        Learn more about Azure Tags in [Use tags to organize your Azure resources and management hierarchy](../azure-resource-manager/management/tag-resources.md).

### Confirmation

When the connector is successfully created, and AWS Security Hub has been configured properly:

- Defender for Cloud scans the environment for AWS EC2 instances, onboarding them to Azure Arc, enabling to install the Log Analytics agent and providing threat protection and security recommendations. 

- The Defender for Cloud service scans for new AWS EC2 instances every 6 hours and onboards them according to the configuration.

- The AWS CIS standard is shown in the Defender for Cloud's regulatory compliance dashboard.

- If Security Hub policy is enabled, recommendations will appear in the Defender for Cloud portal and the  regulatory compliance dashboard 5-10 minutes after onboard completes.

:::image type="content" source="./media/quickstart-onboard-aws/aws-resources-in-recommendations.png" alt-text="Screenshot that shows the AWS resources and recommendations in Defender for Cloud's recommendations page." lightbox="./media/quickstart-onboard-aws/aws-resources-in-recommendations.png":::

## Remove classic AWS connectors

If you have any existing connectors created with the classic cloud connectors experience, remove them first:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Defender for Cloud** > **Environment settings**.

1. Select the option to switch back to the classic connectors experience.

    :::image type="content" source="media/quickstart-onboard-gcp/classic-connectors-experience.png" alt-text="Screenshot of switching back to the classic cloud connectors experience in Defender for Cloud." lightbox="media/quickstart-onboard-gcp/classic-connectors-experience.png":::

1. For each connector, select the three dots button **…** at the end of the row, and select **Delete**.

1. On AWS, delete the role ARN, or the credentials created for the integration.

## Connect your GCP project using the classic connector

To connect your GCP project using the classic connector:

### Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- Access to a GCP project.

- Required roles and permissions: **Owner** or **Contributor** on the relevant Azure Subscription.

You can learn more about Defender for Cloud's pricing on [the pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

### Connect your GCP project using the classic connector

Create a connector for every organization you want to monitor from Defender for Cloud.

When connecting your GCP projects to specific Azure subscriptions, consider the [Google Cloud resource hierarchy](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy#resource-hierarchy-detail) and these guidelines:

- You can connect your GCP projects to Defender for Cloud in the *organization* level
- You can connect multiple organizations to one Azure subscription
- You can connect multiple organizations to multiple Azure subscriptions
- When you connect an organization, all *projects* within that organization are added to Defender for Cloud

### Set up GCP Security Command Center with Security Health Analytics

For all the GCP projects in your organization, you must also:

1. Set up **GCP Security Command Center** using [these instructions from the GCP documentation](https://cloud.google.com/security-command-center/docs/quickstart-scc-setup).

1. Enable **Security Health Analytics** using [these instructions from the GCP documentation](https://cloud.google.com/security-command-center/docs/how-to-use-security-health-analytics).

1. Verify that there's data flowing to the Security Command Center.

The instructions for connecting your GCP environment for security configuration follow Google's recommendations for consuming security configuration recommendations. The integration applies Google Security Command Center and consumes extra resources that might impact your billing.

When you first enable Security Health Analytics, it might take several hours for data to be available.

### Enable GCP Security Command Center API

1. Navigate to From Google's **Cloud Console API Library**, select each project in the organization you want to connect to Microsoft Defender for Cloud.

1. In the API Library, find and select **Security Command Center API**.

1. On the API's page, select **ENABLE**.

Learn more about the [Security Command Center API](https://cloud.google.com/security-command-center/docs/reference/rest/).

### Create a dedicated service account for the security configuration integration

1. In the **GCP Console**, select a project from the organization in which you're creating the required service account. 

    > [!NOTE]
    > When this service account is added at the organization level, it'll be used to access the data gathered by Security Command Center from all of the other enabled projects in the organization. 

1. In the **IAM & admin** section of the navigation menu, select **Service accounts**.

1. Select **CREATE SERVICE ACCOUNT**.

1. Enter an account name, and select **Create**.

1. Specify the **Role** as **Defender for Cloud Admin Viewer**, and select **Continue**.

1. The **Grant users access to this service account** section is optional. Select **Done**.

1. Copy the **Email value** of the created service account, and save it for later use.

1. In the **IAM & admin** section of the navigation menu, select **IAM**.

    1. Switch to organization level.
    
    1. Select **ADD**.
    
    1. In the **New members** field, paste the **Email value** you copied earlier.
    
    1. Specify the role as **Defender for Cloud Admin Viewer** and then select **Save**.

    :::image type="content" source="./media/quickstart-onboard-gcp/iam-settings-gcp-permissions-admin-viewer.png" alt-text="Screenshot that shows how to set the relevant GCP permissions." lightbox="./media/quickstart-onboard-gcp/iam-settings-gcp-permissions-admin-viewer.png":::

### Create a private key for the dedicated service account

1. Switch to project level.

1. In the **IAM & admin** section of the navigation menu, select **Service accounts**.

1. Open the dedicated service account and select Edit.

1. In the **Keys** section, select **ADD KEY** and then **Create new key**.

1. In the Create private key screen, select **JSON** and then select **CREATE**.

1. Save this JSON file for later use.

### Connect GCP to Defender for Cloud

1. From Defender for Cloud's menu, open **Environment settings** and select the option to switch back to the classic connectors experience.

    :::image type="content" source="media/quickstart-onboard-gcp/classic-connectors-experience.png" alt-text="Screenshot that shows how to switch back to the classic cloud connectors experience in Defender for Cloud." lightbox="media/quickstart-onboard-gcp/classic-connectors-experience.png" :::

1. Select add GCP project.

1. In the onboarding page:

    1. Validate the chosen subscription.
    
    1. In the **Display name** field, enter a display name for the connector.
    
    1. In the **Organization ID** field, enter your organization's ID. If you don't know it, see [Creating and managing organizations](https://cloud.google.com/resource-manager/docs/creating-managing-organization).
    
    1. In the **Private key** file box, browse to the JSON file you downloaded in [Create a private key for the dedicated service account](#create-a-private-key-for-the-dedicated-service-account).
    
 1. Select **Next**

### Confirmation

When the connector is successfully created, and GCP Security Command Center has been configured properly:

- The GCP CIS standard is shown in the Defender for Cloud's regulatory compliance dashboard.

- Security recommendations for your GCP resources will appear in the Defender for Cloud portal and the regulatory compliance dashboard 5-10 minutes after onboard completes:

    :::image type="content" source="./media/quickstart-onboard-gcp/gcp-resources-in-recommendations.png" alt-text="Screenshot that shows the GCP resources and recommendations in Defender for Cloud's recommendations page." lightbox="./media/quickstart-onboard-gcp/gcp-resources-in-recommendations.png" :::

## Remove classic GCP connectors

If you have any existing connectors created with the classic cloud connectors experience, remove them first:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Defender for Cloud** > **Environment settings**.

1. Select the option to switch back to the classic connectors experience.

    :::image type="content" source="media/quickstart-onboard-gcp/classic-connectors-experience.png" alt-text="A screenshot that shows how to switch back to the classic cloud connectors experience in Defender for Cloud." lightbox="media/quickstart-onboard-gcp/classic-connectors-experience.png":::

1. For each connector, select the three dot button at the end of the row, and select **Delete**.

## Next steps

- [Protect all of your resources with Defender for Cloud](enable-all-plans.md)
