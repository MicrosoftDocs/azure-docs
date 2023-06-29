---
title: 'Quickstart: Connect an AWS account to Microsoft Defender for Cloud'
description: Defend your AWS resources by using Microsoft Defender for Cloud.
ms.topic: quickstart
ms.date: 06/26/2023
author: dcurwin
ms.author: dacurwin
zone_pivot_groups: connect-aws-accounts
ms.custom: mode-other, ignite-2022
---
# Quickstart: Connect an AWS account to Microsoft Defender for Cloud

Cloud workloads commonly span multiple cloud platforms. Cloud security services must do the same. Microsoft Defender for Cloud helps protect workloads in Azure, Amazon Web Services (AWS), Google Cloud Platform (GCP), GitHub, and Azure DevOps.

In this quickstart, you connect an AWS account to Microsoft Defender for Cloud by using either:

- **Native cloud connector** (recommended): Provides an agentless connection to your AWS account that you can extend with the Microsoft Defender plans in Defender for Cloud to help secure your AWS resources:

  - [Microsoft Defender Cloud Security Posture Management](overview-page.md) assesses your AWS resources according to AWS-specific security recommendations and reflects your security posture in a security score. The [asset inventory](asset-inventory.md) shows all of your protected AWS resources. The [regulatory compliance dashboard](regulatory-compliance-dashboard.md) shows your compliance with built-in standards specific to AWS, including AWS CIS, AWS PCI DSS, and AWS Foundational Security Best Practices.
  - [Microsoft Defender for Servers](defender-for-servers-introduction.md) brings threat detection and advanced defenses to [supported Windows and Linux EC2 instances](supported-machines-endpoint-solutions-clouds-servers.md?tabs=tab/features-multicloud).
  - [Microsoft Defender for Containers](defender-for-containers-introduction.md) brings threat detection and advanced defenses to [supported Amazon EKS clusters](supported-machines-endpoint-solutions-clouds-containers.md).
  - [Microsoft Defender for SQL](defender-for-sql-introduction.md) brings threat detection and advanced defenses to your SQL Server instances running on AWS EC2 and AWS RDS Custom for SQL Server.

- **Classic cloud connector**: Requires configuration in your AWS account to create a user that Defender for Cloud can use to connect to your AWS environment.

  The option to select the classic connector is available only if you previously onboarded an AWS account by using the classic connector.
  
  If you have classic cloud connectors, we recommend that you [delete these connectors](#remove-classic-connectors) and use the native connector to reconnect to the account. Using both the classic and native connectors can produce duplicate recommendations.

For a reference list of all the recommendations that Defender for Cloud can provide for AWS resources, see [Security recommendations for AWS resources - a reference guide](recommendations-reference-aws.md).

This screenshot shows AWS accounts displayed in the Defender for Cloud [overview dashboard](overview-page.md):

:::image type="content" source="./media/quickstart-onboard-aws/aws-account-in-overview.png" alt-text="Screenshot that shows four AWS projects listed on the overview dashboard in Defender for Cloud." lightbox="./media/quickstart-onboard-aws/aws-account-in-overview.png":::

You can learn more by watching the [New AWS connector in Defender for Cloud](episode-one.md) video from the *Defender for Cloud in the Field* video series.

::: zone pivot="env-settings"

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|The [Defender for SQL](defender-for-sql-introduction.md) plan is billed at the same price as Azure resources.<br>The [Defender for Containers](defender-for-containers-introduction.md) plan is free during the preview. After that, it's billed for AWS at the same price as for Azure resources.<br>For every AWS machine connected to Azure, the [Defender for Servers](defender-for-servers-introduction.md) plan is billed at the same price as the Defender for Servers plan for Azure machines.<br>[Learn more about Defender plan pricing and billing](enhanced-security-features-overview.md#faq---pricing-and-billing).|
|Required roles and permissions:|**Contributor** permission for the relevant Azure subscription. <br> **Administrator** permission on the AWS account.|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial<br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet)|

## Prerequisites

The native cloud connector requires access to an AWS account.

The following sections describe more requirements, based on the plan that you choose.

### Defender for Containers

To enable the Defender for Containers plan, you need:

- At least one Amazon EKS cluster with permission to access to the EKS Kubernetes API server. If you need to create a new EKS cluster, follow the instructions in [Getting started with Amazon EKS – eksctl](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html).
- The resource capacity to create a new Amazon SQS queue, Kinesis Data Firehose delivery stream, and Amazon S3 bucket in the cluster's region.

### Defender for SQL

To enable the Defender for SQL plan, you need:

- Microsoft Defender for SQL enabled on your subscription. [Learn how to enable protection on all of your databases](quickstart-enable-database-protections.md).

- An active AWS account, with EC2 instances running SQL Server or RDS Custom for SQL Server.

- Azure Arc for servers installed on your EC2 instances or RDS Custom for SQL Server.
  
We recommend that you use the auto-provisioning process to install Azure Arc on all of your existing and future EC2 instances. To enable the Azure Arc auto-provisioning, you need **Owner** permission on the relevant Azure subscription.

AWS Systems Manager (SSM) manages auto-provisioning by using the SSM Agent. Some Amazon Machine Images (AMIs) already have the [SSM Agent preinstalled](https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html). If your EC2 instances don't have the SSM Agent, install it by using these instructions from Amazon: [Install SSM Agent for a hybrid and multicloud environment (Windows)](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-managed-win.html).

Ensure that your SSM Agent has the managed policy [AmazonSSMManagedInstanceCore](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html), which enables core functionality for the AWS Systems Manager service.

Enable these other extensions on the Azure Arc-connected machines:
  
- Microsoft Defender for Endpoint
- A vulnerability assessment solution (TVM or Qualys)
- The Log Analytics agent on Azure Arc-connected machines or the Azure Monitor agent

Make sure the selected Log Analytics workspace has a security solution installed. The Log Analytics agent and the Azure Monitor agent are currently configured at the subscription level. All of your AWS accounts and GCP projects under the same subscription will inherit the subscription settings for the Log Analytics agent and the Azure Monitor agent.

[Learn more about monitoring components](monitoring-components.md) for Defender for Cloud.

### Defender for Servers

To enable the Defender for Servers plan, you need:

- Microsoft Defender for Servers enabled on your subscription. Learn how to enable plans in [Enable enhanced security features](enable-enhanced-security.md).

- An active AWS account, with EC2 instances.

- Azure Arc for servers installed on your EC2 instances.
  
We recommend that you use the auto-provisioning process to install Azure Arc on all of your existing and future EC2 instances. To enable the Azure Arc auto-provisioning, you need **Owner** permission on the relevant Azure subscription.

AWS Systems Manager manages auto-provisioning by using the SSM Agent. Some AMIs already have the [SSM Agent preinstalled](https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html). If your EC2 instances don't have the SSM Agent, install it by using either of the following instructions from Amazon:

- [Install SSM Agent for a hybrid and multicloud environment (Windows)](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-managed-win.html)
- [Install SSM Agent for a hybrid and multicloud environment (Linux)](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-managed-linux.html)

Ensure that your SSM Agent has the managed policy [AmazonSSMManagedInstanceCore](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html), which enables core functionality for the AWS Systems Manager service.

Defender for Servers assigns tags to your AWS resources to manage the auto-provisioning process. You must have these tags properly assigned to the following resources so that Defender for Cloud can manage them: `AccountId`, `Cloud`, `InstanceId`, and `MDFCSecurityConnector`.

If you want to manually install Azure Arc on your existing and future EC2 instances, use the [EC2 instances should be connected to Azure Arc](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/231dee23-84db-44d2-bd9d-c32fbcfb42a3) recommendation to identify instances that don't have Azure Arc installed.

Enable these other extensions on the Azure Arc-connected machines:
  
- Microsoft Defender for Endpoint
- A vulnerability assessment solution (TVM or Qualys)
- The Log Analytics agent on Azure Arc-connected machines or the Azure Monitor agent

Make sure the selected Log Analytics workspace has a security solution installed. The Log Analytics agent and the Azure Monitor agent are currently configured in the subscription level. All of your AWS accounts and GCP projects under the same subscription will inherit the subscription settings for the Log Analytics agent and the Azure Monitor agent.

[Learn more about monitoring components](monitoring-components.md) for Defender for Cloud.

## Remove classic connectors

If you have any classic connectors, use the following steps to remove them before you connect your AWS account:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to **Defender for Cloud** > **Environment settings**.

1. Select the option to switch back to the classic connectors experience.

    :::image type="content" source="media/quickstart-onboard-gcp/classic-connectors-experience.png" alt-text="Screenshot that shows switching back to the classic cloud connectors experience in Defender for Cloud.":::

1. For each connector, select the ellipsis (**…**) button at the end of the row, and then select **Delete**.

1. On AWS, delete the Amazon Resource Name (ARN) role or the credentials created for the integration.

## Connect your AWS account

To connect your AWS account to Defender for Cloud by using a native connector:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to **Defender for Cloud** > **Environment settings**.

1. Select **Add environment** > **Amazon Web Services**.

    :::image type="content" source="media/quickstart-onboard-aws/add-aws-account-environment-settings.png" alt-text="Screenshot that shows connecting an AWS account to an Azure subscription.":::

1. Enter the details of the AWS account, including the location where you'll store the connector resource. You can also scan specific AWS regions or all available regions (default) on the AWS public cloud.

    :::image type="content" source="media/quickstart-onboard-aws/add-aws-account-details.png" alt-text="Screenshot that shows the tab for entering account details for an AWS account.":::

   Optionally, select **Management account** to create a connector to a management account. Connectors are created for each member account discovered under the provided management account. Auto-provisioning is enabled for all of the newly onboarded accounts.

    > [!NOTE]
    > Defender for Cloud can be connected to each AWS account or management account only once.

1. Select **Next: Select plans**.<a name="cloudtrail-implications-note"></a>

   The **Select plans** tab is where you choose which Defender for Cloud capabilities to enable for this AWS account. Each plan has its own requirements for permissions and might incur charges.

    :::image type="content" source="media/quickstart-onboard-aws/add-aws-account-plans-selection.png" alt-text="Screenshot that shows the tab for selecting plans." lightbox="media/quickstart-onboard-aws/add-aws-account-plans-selection.png":::

    > [!IMPORTANT]
    > To present the current status of your recommendations, the Microsoft Defender Cloud Security Posture Management plan queries the AWS resource APIs several times a day. These read-only API calls incur no charges, but they *are* registered in CloudTrail if you've enabled a trail for read events.
    >
    > As explained in [the AWS documentation](https://aws.amazon.com/cloudtrail/pricing/), there are no additional charges for keeping one trail. If you're exporting the data out of AWS (for example, to an external SIEM system), this increased volume of calls might also increase ingestion costs. In such cases, We recommend filtering out the read-only calls from the Defender for Cloud user or ARN role: `arn:aws:iam::[accountId]:role/CspmMonitorAws`. (This is the default role name. Confirm the role name configured on your account.)

1. By default, the **Servers** plan is set to **On**. This setting is necessary to extend the coverage of Defender for Servers to AWS EC2. Ensure that you've fulfilled the [network requirements for Azure Arc](../azure-arc/servers/network-requirements.md?tabs=azure-cloud).

    Optionally, select **Configure** to edit the configuration as required.

    > [!NOTE]
    > The respective Azure Arc servers for EC2 instances or GCP virtual machines that no longer exist (and the respective Azure Arc servers with a status of [Disconnected or Expired](https://learn.microsoft.com/azure/azure-arc/servers/overview)) are removed after 7 days. This process removes irrelevant Azure ARC entities, ensuring that only Azure Arc servers related to existing instances are displayed.

1. By default, the **Containers** plan is set to **On**. This setting is necessary to have Defender for Containers protect your AWS EKS clusters. Ensure that you've fulfilled the [network requirements](./defender-for-containers-enable.md?pivots=defender-for-container-eks&source=docs&tabs=aks-deploy-portal%2ck8s-deploy-asc%2ck8s-verify-asc%2ck8s-remove-arc%2caks-removeprofile-api#network-requirements) for the Defender for Containers plan.

    > [!NOTE]
    > Azure Arc-enabled Kubernetes, the Azure Arc extension for Microsoft Defender, and the Azure Arc extension for Azure Policy should be installed. Use the dedicated Defender for Cloud recommendations to deploy the extensions (and Azure Arc, if necessary), as explained in [Protect Amazon Elastic Kubernetes Service clusters](defender-for-containers-enable.md?tabs=defender-for-container-eks).

    Optionally, select **Configure** to edit the configuration as required. If you choose to turn off this configuration, the **Threat detection (control plane)** feature will be disabled. [Learn more about feature availability](supported-machines-endpoint-solutions-clouds-containers.md).

1. By default, the **Databases** plan is set to **On**. This setting is necessary to extend coverage of Defender for SQL to AWS EC2 and RDS Custom for SQL Server.

    Optionally, select **Configure** to edit the configuration as required. We recommend that you leave it set to the default configuration.

1. Select **Next: Configure access**.

    a. Choose a deployment type:

       - **Default access**: Allows Defender for Cloud to scan your resources and automatically include future capabilities.
       - **Least privilege access**: Grants Defender for Cloud access only to the current permissions needed for the selected plans. If you select the least privileged permissions, you'll receive notifications on any new roles and permissions that are required to get full functionality for connector health.

    b. Choose a deployment method: **AWS CloudFormation** or **Terraform**.

    :::image type="content" source="media/quickstart-onboard-aws/aws-configure-access.png" alt-text="Screenshot that shows the configure access and its deployment options and instructions.":::

1. Follow the on-screen instructions for the selected deployment method to complete the required dependencies on AWS. If you're onboarding a management account, you need to run the CloudFormation template both as Stack and as StackSet. Connectors are created for the member accounts up to 24 hours after the onboarding.

   For more information about this step, see [CloudFormation deployment source](#cloudformation-deployment-source) later in this article.

1. Select **Next: Review and generate**.

1. Select **Create**.

Defender for Cloud immediately starts scanning your AWS resources. You'll see security recommendations within a few hours. For a reference list of all the recommendations that Defender for Cloud can provide for AWS resources, see [Security recommendations for AWS resources - a reference guide](recommendations-reference-aws.md).

### AWS authentication process

Federated authentication is used between Microsoft Defender for Cloud and AWS. All of the resources related to the authentication are created as a part of the CloudFormation template deployment, including:

- An identity provider (OpenID Connect).
- Identity and access management (IAM) roles with a federated principal (connected to the identity providers).

The architecture of the authentication process across clouds is as follows:

:::image type="content" source="media/quickstart-onboard-aws/architecture-authentication-across-clouds.png" alt-text="Diagram that shows the architecture of the authentication process across clouds." lightbox="media/quickstart-onboard-aws/architecture-authentication-across-clouds.png":::

1. Microsoft Defender Cloud Security Posture Management acquires an Azure Active Directory (Azure AD) token with a validity lifetime of 1 hour. Azure AD signs the token by using the RS256 algorithm.

1. The Azure AD token is exchanged with AWS short-living credentials. The Microsoft Defender Cloud Security Posture Management service assumes the cloud security posture management (CSPM) IAM role by using web identity.

1. Because the principle of the role is a federated identity as defined in a trust relationship policy, the AWS identity provider validates the Azure AD token against Azure AD through a process that includes:

    - Audience validation
    - Signing of the token
    - Certificate thumbprint

1. The Microsoft Defender for Cloud CSPM role is assumed only after the validation conditions defined at the trust relationship are met.

   AWS uses the conditions defined for the role level for validation. These conditions allow only the Microsoft Defender for Cloud CSPM application (validated audience) to access the specific role. No other Microsoft token can access the role.

1. After the AWS identity provider validates the Azure AD token, AWS Security Token Service (STS) exchanges the token with AWS short-living credentials. Microsoft Defender Cloud Security Posture Management uses these credentials to scan the AWS account.

### CloudFormation deployment source

As part of connecting an AWS account to Microsoft Defender for Cloud, you deploy a CloudFormation template to the AWS account. This template creates all of the required resources for Defender for Cloud to connect to the AWS account.

Deploy the CloudFormation template by using Stack (or StackSet if you have a management account). When you're deploying the template, the Stack creation wizard offers the following options:

:::image type="content" source="media/quickstart-onboard-aws/cloudformation-template.png" alt-text="Screenshot that shows the Stack creation wizard with options for template sources." lightbox="media/quickstart-onboard-aws/cloudformation-template.png":::

- **Amazon S3 URL**: Upload the downloaded CloudFormation template to your own S3 bucket with your own security configurations. Enter the URL to the S3 bucket in the AWS deployment wizard.

- **Upload a template file**: AWS automatically creates an S3 bucket that the CloudFormation template will be saved to. The automation for the S3 bucket has a security misconfiguration that causes the `S3 buckets should require requests to use Secure Socket Layer` recommendation to appear. You can remediate this recommendation by applying the following policy:

    ```json
    {  
      "Id": "ExamplePolicy",  
      "Version": "2012-10-17",  
      "Statement": [  
        {  
          "Sid": "AllowSSLRequestsOnly",  
          "Action": "s3:*",  
          "Effect": "Deny",  
          "Resource": [  
            "<S3_Bucket ARN>",  
            "<S3_Bucket ARN>/*"  
          ],  
          "Condition": {  
            "Bool": {  
              "aws:SecureTransport": "false"  
            }  
          },  
          "Principal": "*"  
        }  
      ]  
    }  
    ```

::: zone-end

::: zone pivot="classic-connector"

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|Requires [Microsoft Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features)|
|Required roles and permissions:|**Owner** on the relevant Azure subscription.<br>**Contributor** can also connect an AWS account if an owner provides the service principal details.|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial<br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet)|

## Connect your AWS account

Use the following steps to create your AWS cloud connector.

### Step 1: Set up AWS Security Hub

To view security recommendations for multiple regions, repeat the following steps for each relevant region.

If you're using an AWS management account, repeat the following steps to configure the management account and all connected member accounts across all relevant regions.

1. Enable [AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/gs-console.html).
1. Enable [AWS Security Hub](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-settingup.html).
1. Verify that data is flowing to Security Hub. When you first enable Security Hub, it might take several hours for data to be available.

### Step 2: Set up authentication for Defender for Cloud in AWS

There are two ways to allow Defender for Cloud to authenticate to AWS:

- **Create an IAM role for Defender for Cloud** (recommended): The more secure method.
- **Create an AWS user for Defender for Cloud**: A less secure option if you don't have identity and access management (IAM) enabled.

#### Create an IAM role for Defender for Cloud

1. From your Amazon Web Services console, under **Security, Identity & Compliance**, select **IAM**.

    :::image type="content" source="./media/quickstart-onboard-aws/aws-identity-and-compliance.png" alt-text="Screenshot that shows AWS services.":::

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

1. In the **Roles** list, choose the role that you created.

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

### Step 3: Configure the SSM Agent

AWS Systems Manager is required for automating tasks across your AWS resources. If your EC2 instances don't have the SSM Agent, follow the relevant instructions from Amazon:

- [Installing and Configuring SSM Agent on Windows Instances](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-ssm-win.html)
- [Installing and Configuring SSM Agent on Amazon EC2 Linux Instances](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-ssm-agent.html)

### Step 4: Complete Azure Arc prerequisites

1. Make sure the appropriate [Azure resources providers](../azure-arc/servers/prerequisites.md#azure-resource-providers) are registered:
    - `Microsoft.HybridCompute`
    - `Microsoft.GuestConfiguration`

1. As an **Owner** on the subscription that you want to use for onboarding, create a service principal for Azure Arc onboarding, as described in [Create a service principal for onboarding at scale](../azure-arc/servers/onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale).

### Step 5: Connect AWS to Defender for Cloud

1. From the Defender for Cloud menu, open **Environment settings**. Then select the option to switch back to the classic cloud connectors experience.

    :::image type="content" source="media/quickstart-onboard-gcp/classic-connectors-experience.png" alt-text="Screenshot that shows switching back to the classic cloud connectors experience in Defender for Cloud.":::

1. Select **Add AWS account**.

    :::image type="content" source="./media/quickstart-onboard-aws/add-aws-account.png" alt-text="Screenshot that shows the button for adding an AWS account on the pane for multicloud connectors in Defender for Cloud.":::
1. Configure the options on the **AWS authentication** tab:
    1. For **Display name**, enter a name for the connector.
    1. For **Subscription**, confirm that the value is correct. It's the subscription that will include the connector and AWS Security Hub recommendations.
    1. Depending on the authentication option that you chose when you [set up authentication for Defender for Cloud in AWS](#step-2-set-up-authentication-for-defender-for-cloud-in-aws):
        - For **Authentication method**, select  **Assume Role**. Then, for **AWS role ARN**, paste the ARN that you got when you [created an IAM role for Defender for Cloud](#create-an-iam-role-for-defender-for-cloud).

            :::image type="content" source="./media/quickstart-onboard-aws/paste-arn-in-portal.png" alt-text="Screenshot that shows the location for pasting the ARN file in the AWS connection wizard in the Azure portal.":::

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

### Step 6: Confirm the connection

After you successfully create the connector and properly configure AWS Security Hub:

- Defender for Cloud scans the environment for AWS EC2 instances and onboards them to Azure Arc. You can then install the Log Analytics agent and get threat protection and security recommendations.
- The Defender for Cloud service scans for new AWS EC2 instances every 6 hours and onboards them according to the configuration.
- The AWS CIS standard appears in the regulatory compliance dashboard in Defender for Cloud.
- If a Security Hub policy is enabled, recommendations appear in the Defender for Cloud portal and the regulatory compliance dashboard 5 to 10 minutes after onboarding finishes.

::: zone-end

:::image type="content" source="./media/quickstart-onboard-aws/aws-resources-in-recommendations.png" alt-text="Screenshot that shows AWS resources and recommendations for Defender for Cloud." lightbox="./media/quickstart-onboard-aws/aws-resources-in-recommendations.png":::

## Monitor your AWS resources

The security recommendations page in Defender for Cloud displays your AWS resources. You can use the environments filter to enjoy multicloud capabilities in Defender for Cloud: view the recommendations for Azure, AWS, and GCP resources together.

To view all the active recommendations for your resources by resource type, use the asset inventory page in Defender for Cloud and filter to the AWS resource type in which you're interested.

:::image type="content" source="./media/quickstart-onboard-aws/aws-resource-types-in-inventory.png" alt-text="Screenshot of AWS options in the asset inventory page's resource type filter.":::

## Learn more

Check out the following blogs:

- [Ignite 2021: Microsoft Defender for Cloud news](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/ignite-2021-microsoft-defender-for-cloud-news/ba-p/2882807)
- [Security posture management and server protection for AWS and GCP](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/security-posture-management-and-server-protection-for-aws-and/ba-p/3271388)

## Next steps

Connecting your AWS account is part of the multicloud experience available in Microsoft Defender for Cloud. For related information, see:

- [Connect your GCP projects to Microsoft Defender for Cloud](quickstart-onboard-gcp.md)
- [Troubleshoot your multicloud connectors](troubleshooting-guide.md#troubleshooting-the-native-multicloud-connector)
- [Microsoft Defender for Cloud common questions](faq-general.yml)
