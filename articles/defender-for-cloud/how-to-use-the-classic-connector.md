---
title: Manage classic cloud connectors

description: Learn how to manage AWS and GCP classic connectors and remove them from your subscription.
ms.topic: how-to
ms.date: 06/29/2023
---

# Manage classic cloud connectors (retired)

The retired *classic cloud connector* requires configuration in your Google Cloud Platform (GCP) project or Amazon Web Services (AWS) account to create a user that Microsoft Defender for Cloud can use to connect to your GCP project or AWS environment. The classic connector is available only to customers who previously used it to connect GCP projects or AWS environments.

To connect a [GCP project](quickstart-onboard-gcp.md) or an [AWS account](quickstart-onboard-aws.md), you should use the native connector available in Defender for Cloud.

## Connect your AWS account by using the classic connector

### Prerequisites

To complete the procedures for connecting an AWS account, you need:

- A Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free one](https://azure.microsoft.com/pricing/free-trial/).

- [Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) enabled on your Azure subscription.

- Access to an AWS account.

- **Owner** permission on the relevant Azure subscription. A **Contributor** can also connect an AWS account if an **Owner** provides the service principal details.

### Set up AWS Security Hub

To view security recommendations for multiple regions, repeat the following steps for each relevant region.

If you're using an AWS management account, repeat the following steps to configure the management account and all connected member accounts across all relevant regions.

1. Enable [AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/gs-console.html).
1. Enable [AWS Security Hub](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-settingup.html).
1. Verify that data is flowing to Security Hub. When you first enable Security Hub, the data might take several hours to become available.

### Set up authentication for Defender for Cloud in AWS

There are two ways to allow Defender for Cloud to authenticate to AWS:

- [Create an identity and access management (IAM) role for Defender for Cloud](#create-an-iam-role-for-defender-for-cloud): The more secure and recommended method.
- [Create an AWS user for Defender for Cloud](#create-an-aws-user-for-defender-for-cloud): A less secure option if you don't have IAM enabled.

#### Create an IAM role for Defender for Cloud

1. From your Amazon Web Services console, under **Security, Identity & Compliance**, select **IAM**.

    :::image type="content" source="./media/quickstart-onboard-aws/aws-identity-and-compliance.png" alt-text="Screenshot of the AWS services."  lightbox="./media/quickstart-onboard-aws/aws-identity-and-compliance.png":::

1. Select **Roles** > **Create role**.

1. Select **Another AWS account**.

1. Enter the following details:

    - For **Account ID**, enter the Microsoft account ID **158177204117**, as shown on the AWS connector page in Defender for Cloud.
    - Select **Require External ID**.
    - For **External ID**, enter the subscription ID, as shown on the AWS connector page in Defender for Cloud.

1. Select **Next**.

1. In the **Attach permission policies** section, select the following [AWS managed policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html):

    - `SecurityAudit` (`arn:aws:iam::aws:policy/SecurityAudit`)
    - `AmazonSSMAutomationRole` (`arn:aws:iam::aws:policy/service-role/AmazonSSMAutomationRole`)
    - `AWSSecurityHubReadOnlyAccess` (`arn:aws:iam::aws:policy/AWSSecurityHubReadOnlyAccess`)

1. Optionally, add tags. Adding tags to the user doesn't affect the connection.

1. Select **Next**.

1. In The **Roles** list, choose the role that you created.

1. Save the Amazon Resource Name (ARN) for later.

#### Create an AWS user for Defender for Cloud

1. Open the **Users** tab and select **Add user**.

1. In the **Details** step, enter a username for Defender for Cloud. Select **Programmatic access** for the AWS access type.

1. Select **Next: Permissions**.

1. Select **Attach existing policies directly** and apply the following policies:
    - `SecurityAudit`
    - `AmazonSSMAutomationRole`
    - `AWSSecurityHubReadOnlyAccess`

1. Select **Next: Tags**. Optionally, add tags. Adding tags to the user doesn't affect the connection.

1. Select **Review**.

1. Save the automatically generated **Access key ID** and **Secret access key** CSV files for later.

1. Review the summary, and then select **Create user**.

### Configure the SSM Agent

AWS Systems Manager (SSM) is required for automating tasks across your AWS resources. If your EC2 instances don't have the SSM Agent, follow the relevant instructions from Amazon:

- [Installing and Configuring SSM Agent on Windows Instances](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-ssm-win.html)

- [Installing and Configuring SSM Agent on Amazon EC2 Linux Instances](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-ssm-agent.html)

### Complete the Azure Arc prerequisites

1. Make sure the appropriate [Azure resource providers](../azure-arc/servers/prerequisites.md#azure-resource-providers) are registered:
    - `Microsoft.HybridCompute`
    - `Microsoft.GuestConfiguration`

1. As an **Owner** on the subscription that you want to use for onboarding, create a service principal for Azure Arc onboarding, as described in [Create a service principal for onboarding at scale](../azure-arc/servers/onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale).

### Connect AWS to Defender for Cloud

1. From the Defender for Cloud menu, open **Environment settings**. Then select the option to switch back to the classic connectors experience.

    :::image type="content" source="media/quickstart-onboard-gcp/classic-connectors-experience.png" alt-text="Screenshot that shows how to switch back to the classic connectors experience in Defender for Cloud." lightbox="media/quickstart-onboard-gcp/classic-connectors-experience.png":::

1. Select **Add AWS account**.

    :::image type="content" source="./media/quickstart-onboard-aws/add-aws-account.png" alt-text="Screenshot that shows the button for adding an AWS account on the pane for multicloud connectors in Defender for Cloud." lightbox="./media/quickstart-onboard-aws/add-aws-account.png":::

1. Configure the options on the **AWS authentication** tab:

    1. For **Display name**, enter a name for the connector.

    1. For **Subscription**, confirm that the value is correct. It's the subscription that includes the connector and AWS Security Hub recommendations.

    1. Depending on the authentication option that you chose when you [set up authentication for Defender for Cloud in AWS](#set-up-authentication-for-defender-for-cloud-in-aws), take one of the following actions:
        - For **Authentication method**, select  **Assume Role**. Then, for **AWS role ARN**, paste the ARN that you got when you [created an IAM role for Defender for Cloud](#create-an-iam-role-for-defender-for-cloud).

          :::image type="content" source="./media/quickstart-onboard-aws/paste-arn-in-portal.png" alt-text="Screenshot that shows the location for pasting the ARN file in the AWS connection wizard in the Azure portal." lightbox="./media/quickstart-onboard-aws/paste-arn-in-portal.png":::

        - For **Authentication method**, select **Credentials**. Then, in the relevant boxes, paste the access key and secret key from the CSV files that you saved when you [created an AWS user for Defender for Cloud](#create-an-aws-user-for-defender-for-cloud).

1. Select **Next**.

1. Configure the options on the **Azure Arc Configuration** tab.

    Defender for Cloud discovers the EC2 instances in the connected AWS account and uses SSM to onboard them to Azure Arc. For the list of supported operating systems, see [What operating systems for my EC2 instances are supported?](faq-general.yml) in the common questions.

    1. For **Resource Group** and **Azure Region**, select the resource group and region that the discovered AWS EC2s will be onboarded to in the selected subscription.

    1. Enter the **Service Principal ID** and **Service Principal Client Secret** values for Azure Arc, as described in [Create a service principal for onboarding at scale](../azure-arc/servers/onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale).

    1. If the machine is connecting to the internet via proxy server, specify the proxy server IP address, or the name and port number that the machine uses to communicate with the proxy server. Enter the value in the format `http://<proxyURL>:<proxyport>`.

    1. Select **Review + create**.

1. Review the summary information.

    The **Tags** section lists all Azure tags that are automatically created for each onboarded EC2 instance. Each tag has its own relevant details, so you can easily recognize it in Azure. Learn more about Azure tags in [Use tags to organize your Azure resources and management hierarchy](../azure-resource-manager/management/tag-resources.md).

### Confirm the connection

After you successfully create the connector and properly configure AWS Security Hub:

- Defender for Cloud scans the environment for AWS EC2 instances and onboards them to Azure Arc. You can then install the Log Analytics agent and get threat protection and security recommendations.

- The Defender for Cloud service scans for new AWS EC2 instances every 6 hours and onboards them according to the configuration.

- The AWS CIS standard appears in the regulatory compliance dashboard in Defender for Cloud.

- If a Security Hub policy is enabled, recommendations appear in the Defender for Cloud portal and the regulatory compliance dashboard 5 to 10 minutes after onboarding finishes.

:::image type="content" source="./media/quickstart-onboard-aws/aws-resources-in-recommendations.png" alt-text="Screenshot that shows the AWS resources and recommendations on the recommendations pane in Defender for Cloud." lightbox="./media/quickstart-onboard-aws/aws-resources-in-recommendations.png":::

## Remove classic AWS connectors

To remove any connectors that you created by using the classic connectors experience:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to **Defender for Cloud** > **Environment settings**.

1. Select the option to switch back to the classic connectors experience.

    :::image type="content" source="media/quickstart-onboard-gcp/classic-connectors-experience.png" alt-text="Screenshot that shows switching back to the classic connectors experience in Defender for Cloud." lightbox="media/quickstart-onboard-gcp/classic-connectors-experience.png":::

1. For each connector, select the ellipsis (**…**) button at the end of the row, and then select **Delete**.

1. On AWS, delete the ARN role or the credentials created for the integration.

## Connect your GCP project by using the classic connector

Create a connector for every organization that you want to monitor from Defender for Cloud.

When you're connecting GCP projects to specific Azure subscriptions, consider the [Google Cloud resource hierarchy](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy#resource-hierarchy-detail) and these guidelines:

- You can connect your GCP projects to Defender for Cloud at the *organization* level.
- You can connect multiple organizations to one Azure subscription.
- You can connect multiple organizations to multiple Azure subscriptions.
- When you connect an organization, all projects within that organization are added to Defender for Cloud.

### Prerequisites

To complete the procedures for connecting a GCP project, you need:

- A Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free one](https://azure.microsoft.com/pricing/free-trial/).

- [Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) enabled on your Azure subscription.

- Access to a GCP project.

- The **Owner** or **Contributor** role on the relevant Azure subscription.

You can learn more about Defender for Cloud pricing on [the pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

### Set up GCP Security Command Center with Security Health Analytics

For all the GCP projects in your organization, you must:

1. Set up GCP Security Command Center by using [these instructions from the GCP documentation](https://cloud.google.com/security-command-center/docs/quickstart-scc-setup).

1. Enable Security Health Analytics by using [these instructions from the GCP documentation](https://cloud.google.com/security-command-center/docs/how-to-use-security-health-analytics).

1. Verify that data is flowing to Security Command Center.

The instructions for connecting your GCP environment for security configuration follow Google's recommendations for consuming security configuration recommendations. The integration applies Google Security Command Center and consumes extra resources that might affect your billing.

When you first enable Security Health Analytics, the data might take several hours to become available.

### Enable the GCP Security Command Center API

1. Go to Google's Cloud Console API Library.

1. Select each project in the organization that you want to connect to Microsoft Defender for Cloud.

1. Find and select **Security Command Center API**.

1. On the API's page, select **ENABLE**.

[Learn more about the Security Command Center API](https://cloud.google.com/security-command-center/docs/reference/rest/).

### Create a dedicated service account for the security configuration integration

1. On the GCP console, select a project from the organization in which you're creating the required service account.

    > [!NOTE]
    > When you add this service account at the organization level, it will be used to access the data that Security Command Center gathers from all of the other enabled projects in the organization.

1. In the **IAM & admin** section of the left menu, select **Service accounts**.

1. Select **CREATE SERVICE ACCOUNT**.

1. Enter an account name, and then select **Create**.

1. Specify **Role** as **Defender for Cloud Admin Viewer**, and then select **Continue**.

1. The **Grant users access to this service account** section is optional. Select **Done**.

1. Copy the **Email value** information for the created service account, and save it for later use.

1. In the **IAM & admin** section of the left menu, select **IAM**, and then:

    1. Switch to the organization level.

    1. Select **ADD**.

    1. In the **New members** box, paste the **Email value** information that you copied earlier.

    1. Specify the role as **Security Center Admin Viewer**, and then select **Save**.

    :::image type="content" source="./media/quickstart-onboard-gcp/iam-settings-gcp-permissions-admin-viewer.png" alt-text="Screenshot that shows how to set the relevant GCP permissions." lightbox="./media/quickstart-onboard-gcp/iam-settings-gcp-permissions-admin-viewer.png":::

### Create a private key for the dedicated service account

1. Switch to the project level.

1. In the **IAM & admin** section of the left menu, select **Service accounts**.

1. Open the dedicated service account, and then select **Edit**.

1. In the **Keys** section, select **ADD KEY** > **Create new key**.

1. On the **Create private key** pane, select **JSON**, and then select **CREATE**.

1. Save this JSON file for later use.

### Connect GCP to Defender for Cloud

1. From the Defender for Cloud menu, open **Environment settings**. Then select the option to switch back to the classic connectors experience.

    :::image type="content" source="media/quickstart-onboard-gcp/classic-connectors-experience.png" alt-text="Screenshot that shows how to switch back to the classic connectors experience in Defender for Cloud." lightbox="media/quickstart-onboard-gcp/classic-connectors-experience.png" :::

1. Select **Add GCP project**.

1. On the onboarding page:

    1. Validate the chosen subscription.

    1. In the **Display name** box, enter a display name for the connector.

    1. In the **Organization ID** box, enter your organization's ID. If you don't know it, see the Google guide [Creating and managing organizations](https://cloud.google.com/resource-manager/docs/creating-managing-organization).

    1. In the **Private key** box, browse to the JSON file that you downloaded when you [created a private key for the dedicated service account](#create-a-private-key-for-the-dedicated-service-account).

1. Select **Next**.

### Confirm the connection

After you successfully create the connector and properly configure GCP Security Command Center:

- The GCP CIS standard appears in the regulatory compliance dashboard in Defender for Cloud.

- Security recommendations for your GCP resources appear in the Defender for Cloud portal and the regulatory compliance dashboard 5 to 10 minutes after onboarding finishes.

    :::image type="content" source="./media/quickstart-onboard-gcp/gcp-resources-in-recommendations.png" alt-text="Screenshot that shows the GCP resources and recommendations on the recommendations pane in Defender for Cloud." lightbox="./media/quickstart-onboard-gcp/gcp-resources-in-recommendations.png" :::

## Remove classic GCP connectors

To remove any connectors that you created by using the classic connectors experience:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to **Defender for Cloud** > **Environment settings**.

1. Select the option to switch back to the classic connectors experience.

    :::image type="content" source="media/quickstart-onboard-gcp/classic-connectors-experience.png" alt-text="Screenshot that shows how to switch back to the classic connectors experience in Defender for Cloud." lightbox="media/quickstart-onboard-gcp/classic-connectors-experience.png":::

1. For each connector, select the ellipsis (**...**) button at the end of the row, and then select **Delete**.

## Next steps

- [Protect all of your resources with Defender for Cloud](enable-all-plans.md)
