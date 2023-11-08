---
title: Connect your AWS account
description: Defend your AWS resources by using Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.custom: devx-track-linux
ms.date: 10/22/2023
---

# Connect your AWS account to Microsoft Defender for Cloud

Workloads commonly span multiple cloud platforms. Cloud security services must do the same. Microsoft Defender for Cloud helps protect workloads in Amazon Web Services (AWS), but you need to set up the connection between them and Defender for Cloud.

If you're connecting an AWS account that you previously connected by using the classic connector, you must [remove it](how-to-use-the-classic-connector.md#remove-classic-aws-connectors) first. Using an AWS account that's connected by both the classic and native connectors can produce duplicate recommendations.

The following screenshot shows AWS accounts displayed in the Defender for Cloud [overview dashboard](overview-page.md).

:::image type="content" source="./media/quickstart-onboard-aws/aws-account-in-overview.png" alt-text="Screenshot that shows four AWS projects listed on the overview dashboard in Defender for Cloud." lightbox="./media/quickstart-onboard-aws/aws-account-in-overview.png":::

You can learn more by watching the [New AWS connector in Defender for Cloud](episode-one.md) video from the *Defender for Cloud in the Field* video series.

For a reference list of all the recommendations that Defender for Cloud can provide for AWS resources, see [Security recommendations for AWS resources - a reference guide](recommendations-reference-aws.md).

## Prerequisites

To complete the procedures in this article, you need:

- A Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free one](https://azure.microsoft.com/pricing/free-trial/).

- [Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) set up on your Azure subscription.

- Access to an AWS account.

- **Contributor** permission for the relevant Azure subscription, and **Administrator** permission on the AWS account.

> [!NOTE]
> The AWS connector is not available on the national government clouds (Azure Government, Microsoft Azure operated by 21Vianet).

### Defender for Containers

If you choose the Microsoft Defender for Containers plan, you need:

- At least one Amazon EKS cluster with permission to access to the EKS Kubernetes API server. If you need to create a new EKS cluster, follow the instructions in [Getting started with Amazon EKS – eksctl](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html).
- The resource capacity to create a new Amazon SQS queue, Kinesis Data Firehose delivery stream, and Amazon S3 bucket in the cluster's region.

### Defender for SQL

If you choose the Microsoft Defender for SQL plan, you need:

- Microsoft Defender for SQL enabled on your subscription. [Learn how to protect your databases](tutorial-enable-databases-plan.md).
- An active AWS account, with EC2 instances running SQL Server or RDS Custom for SQL Server.
- Azure Arc for servers installed on your EC2 instances or RDS Custom for SQL Server.

We recommend that you use the auto-provisioning process to install Azure Arc on all of your existing and future EC2 instances. To enable the Azure Arc auto-provisioning, you need **Owner** permission on the relevant Azure subscription.

AWS Systems Manager (SSM) manages auto-provisioning by using the SSM Agent. Some Amazon Machine Images already have the [SSM Agent preinstalled](https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html). If your EC2 instances don't have the SSM Agent, install it by using these instructions from Amazon: [Install SSM Agent for a hybrid and multicloud environment (Windows)](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-managed-win.html).

Ensure that your SSM Agent has the managed policy [AmazonSSMManagedInstanceCore](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html). It enables core functionality for the AWS Systems Manager service.

Enable these other extensions on the Azure Arc-connected machines:
  
- Microsoft Defender for Endpoint
- A vulnerability assessment solution (TVM or Qualys)
- The Log Analytics agent on Azure Arc-connected machines or the Azure Monitor agent

Make sure the selected Log Analytics workspace has a security solution installed. The Log Analytics agent and the Azure Monitor agent are currently configured at the *subscription* level. All of your AWS accounts and Google Cloud Platform (GCP) projects under the same subscription inherit the subscription settings for the Log Analytics agent and the Azure Monitor agent.

[Learn more about monitoring components](monitoring-components.md) for Defender for Cloud.

### Defender for Servers

If you choose the Microsoft Defender for Servers plan, you need:

- Microsoft Defender for Servers enabled on your subscription. Learn how to enable plans in [Enable enhanced security features](enable-enhanced-security.md).
- An active AWS account, with EC2 instances.
- Azure Arc for servers installed on your EC2 instances.

We recommend that you use the auto-provisioning process to install Azure Arc on all of your existing and future EC2 instances. To enable the Azure Arc auto-provisioning, you need **Owner** permission on the relevant Azure subscription.

AWS Systems Manager manages auto-provisioning by using the SSM Agent. Some Amazon Machine Images already have the [SSM Agent preinstalled](https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html). If your EC2 instances don't have the SSM Agent, install it by using either of the following instructions from Amazon:

- [Install SSM Agent for a hybrid and multicloud environment (Windows)](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-managed-win.html)
- [Install SSM Agent for a hybrid and multicloud environment (Linux)](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-managed-linux.html)

Ensure that your SSM Agent has the managed policy [AmazonSSMManagedInstanceCore](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html), which enables core functionality for the AWS Systems Manager service. 

**You must have the SSM Agent for auto provisioning Arc agent on EC2 machines. If the SSM doesn't exist, or is removed from the EC2, the Arc provisioning won’t be able to procced.**

> [!NOTE]
> As part of the cloud formation template that is run during the onboarding process, an automation process is created and triggered every 30 days, over all the EC2s that existed during the initial run of the cloud formation. The goal of this scheduled scan is to ensure that all the relevant EC2s have an IAM profile with the required IAM policy that allows Defender for Cloud to access, manage, and provide the relevant security features (including the Arc agent provisioning). The scan does not apply to EC2s that were created after the run of the cloud formation.

If you want to manually install Azure Arc on your existing and future EC2 instances, use the [EC2 instances should be connected to Azure Arc](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/231dee23-84db-44d2-bd9d-c32fbcfb42a3) recommendation to identify instances that don't have Azure Arc installed.

Enable these other extensions on the Azure Arc-connected machines:
  
- Microsoft Defender for Endpoint
- A vulnerability assessment solution (TVM or Qualys)
- The Log Analytics agent on Azure Arc-connected machines or the Azure Monitor agent

Make sure the selected Log Analytics workspace has a security solution installed. The Log Analytics agent and the Azure Monitor agent are currently configured at the *subscription* level. All of your AWS accounts and GCP projects under the same subscription inherit the subscription settings for the Log Analytics agent and the Azure Monitor agent.

[Learn more about monitoring components](monitoring-components.md) for Defender for Cloud.

Defender for Servers assigns tags to your AWS resources to manage the auto-provisioning process. You must have these tags properly assigned to your resources so that Defender for Cloud can manage them: `AccountId`, `Cloud`, `InstanceId`, and `MDFCSecurityConnector`.

### Defender CSPM

If you choose the Microsoft Defender CSPM plan, you need:

- a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).
- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.
- Connect your [non-Azure machines](quickstart-onboard-machines.md), [AWS accounts](quickstart-onboard-aws.md). 
- In order to gain access to all of the features available from the CSPM plan, the plan must be enabled by the **Subscription Owner**.

Learn more about how to [enable Defender CSPM](tutorial-enable-cspm-plan.md).

## Connect your AWS account

To connect your AWS to Defender for Cloud by using a native connector:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to **Defender for Cloud** > **Environment settings**.

1. Select **Add environment** > **Amazon Web Services**.

    :::image type="content" source="media/quickstart-onboard-aws/add-aws-account-environment-settings.png" alt-text="Screenshot that shows connecting an AWS account to an Azure subscription." lightbox="media/quickstart-onboard-aws/add-aws-account-environment-settings.png":::

1. Enter the details of the AWS account, including the location where you store the connector resource.

    :::image type="content" source="media/quickstart-onboard-aws/add-aws-account-details.png" alt-text="Screenshot that shows the tab for entering account details for an AWS account." lightbox="media/quickstart-onboard-aws/add-aws-account-details.png":::

    ```suggestion
    (Optional) Select **Management account** to create a connector to a management account. Connectors are then created for each member account discovered under the provided management account. Auto-provisioning is also enabled for all of the newly onboarded accounts.
    
    (Optional) Use the AWS regions dropdown menu to select specific AWS regions to be scanned. All regions are selected by default.

## Select Defender plans

In this section of the wizard, you select the Defender for Cloud plans that you want to enable.

1. Select **Next: Select plans**.

    The **Select plans** tab is where you choose which Defender for Cloud capabilities to enable for this AWS account. Each plan has its own [requirements for permissions](concept-aws-connector.md#native-connector-plan-requirements) and might incur [charges](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h).

    :::image type="content" source="media/quickstart-onboard-aws/add-aws-account-plans-selection.png" alt-text="Screenshot that shows the tab for selecting plans for an AWS account." lightbox="media/quickstart-onboard-aws/add-aws-account-plans-selection.png":::

    > [!IMPORTANT]
    > To present the current status of your recommendations, the Microsoft Defender Cloud Security Posture Management plan queries the AWS resource APIs several times a day. These read-only API calls incur no charges, but they *are* registered in CloudTrail if you've enabled a trail for read events.
    >
    > As explained in [the AWS documentation](https://aws.amazon.com/cloudtrail/pricing/), there are no additional charges for keeping one trail. If you're exporting the data out of AWS (for example, to an external SIEM system), this increased volume of calls might also increase ingestion costs. In such cases, we recommend filtering out the read-only calls from the Defender for Cloud user or ARN role: `arn:aws:iam::[accountId]:role/CspmMonitorAws`. (This is the default role name. Confirm the role name configured on your account.)

1. By default, the **Servers** plan is set to **On**. This setting is necessary to extend the coverage of Defender for Servers to AWS EC2. Ensure that you've fulfilled the [network requirements for Azure Arc](../azure-arc/servers/network-requirements.md?tabs=azure-cloud).

    Optionally, select **Configure** to edit the configuration as required.

    > [!NOTE]
    > The respective Azure Arc servers for EC2 instances or GCP virtual machines that no longer exist (and the respective Azure Arc servers with a status of [Disconnected or Expired](/azure/azure-arc/servers/overview)) are removed after 7 days. This process removes irrelevant Azure Arc entities to ensure that only Azure Arc servers related to existing instances are displayed.

1. By default, the **Containers** plan is set to **On**. This setting is necessary to have Defender for Containers protect your AWS EKS clusters. Ensure that you've fulfilled the [network requirements](./defender-for-containers-enable.md?pivots=defender-for-container-eks&source=docs&tabs=aks-deploy-portal%2ck8s-deploy-asc%2ck8s-verify-asc%2ck8s-remove-arc%2caks-removeprofile-api#network-requirements) for the Defender for Containers plan.

    > [!NOTE]
    > Azure Arc-enabled Kubernetes, the Azure Arc extensions for Defender agent, and Azure Policy for Kubernetes should be installed. Use the dedicated Defender for Cloud recommendations to deploy the extensions (and Azure Arc, if necessary), as explained in [Protect Amazon Elastic Kubernetes Service clusters](defender-for-containers-enable.md?tabs=defender-for-container-eks).

    Optionally, select **Configure** to edit the configuration as required. If you choose to turn off this configuration, the **Threat detection (control plane)** feature is also disabled. [Learn more about feature availability](supported-machines-endpoint-solutions-clouds-containers.md).

1. By default, the **Databases** plan is set to **On**. This setting is necessary to extend coverage of Defender for SQL to AWS EC2 and RDS Custom for SQL Server.

    (Optional) Select **Configure** to edit the configuration as required. We recommend that you leave it set to the default configuration.

1. Select **Configure access** and select the following:

    a. Select a deployment type:

    - **Default access**: Allows Defender for Cloud to scan your resources and automatically include future capabilities.
    - **Least privilege access**: Grants Defender for Cloud access only to the current permissions needed for the selected plans. If you select the least privileged permissions, you'll receive notifications on any new roles and permissions that are required to get full functionality for connector health.

    b. Select a deployment method: **AWS CloudFormation** or **Terraform**.

    :::image type="content" source="media/quickstart-onboard-aws/add-aws-account-configure-access.png" alt-text="Screenshot that shows deployment options and instructions for configuring access." lightbox="media/quickstart-onboard-aws/add-aws-account-configure-access.png":::

    > [!NOTE]
    > If you select **Management account** to create a connector to a management account, then the tab to onboard with Terraform is not visible in the UI, but you can still onboard using Terraform, similar to what's covered at [Onboarding your AWS/GCP environment to Microsoft Defender for Cloud with Terraform - Microsoft Community Hub](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/onboarding-your-aws-gcp-environment-to-microsoft-defender-for/ba-p/3798664).

1. Follow the on-screen instructions for the selected deployment method to complete the required dependencies on AWS. If you're onboarding a management account, you need to run the CloudFormation template both as Stack and as StackSet. Connectors are created for the member accounts up to 24 hours after the onboarding.

1. Select **Next: Review and generate**.

1. Select **Create**.

Defender for Cloud immediately starts scanning your AWS resources. Security recommendations appear within a few hours.

## Deploy a CloudFormation template to your AWS account

As part of connecting an AWS account to Microsoft Defender for Cloud, you deploy a CloudFormation template to the AWS account. This template creates all of the required resources for the connection.

Deploy the CloudFormation template by using Stack (or StackSet if you have a management account). When you're deploying the template, the Stack creation wizard offers the following options.

:::image type="content" source="media/quickstart-onboard-aws/cloudformation-template.png" alt-text="Screenshot that shows the Stack creation wizard with options for template sources." lightbox="media/quickstart-onboard-aws/cloudformation-template.png":::

- **Amazon S3 URL**: Upload the downloaded CloudFormation template to your own S3 bucket with your own security configurations. Enter the URL to the S3 bucket in the AWS deployment wizard.

- **Upload a template file**: AWS automatically creates an S3 bucket that the CloudFormation template is saved to. The automation for the S3 bucket has a security misconfiguration that causes the `S3 buckets should require requests to use Secure Socket Layer` recommendation to appear. You can remediate this recommendation by applying the following policy:

    ```bash
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

    > [!NOTE]
    > When running the CloudFormation StackSets when onboarding an AWS management account, you might encounter the following error message:
    > `You must enable organizations access to operate a service managed stack set`
    >
    > This error indicates that you have noe enabled [the trusted access for AWS Organizations](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-orgs-activate-trusted-access.html).
    >
    > To remediate this error message, your CloudFormation StackSets page has a prompt with a button that you can select to enable trusted access. After trusted access is enabled, the CloudFormation Stack must be run again.

## Monitor your AWS resources

The security recommendations page in Defender for Cloud displays your AWS resources. You can use the environments filter to enjoy multicloud capabilities in Defender for Cloud.

To view all the active recommendations for your resources by resource type, use the asset inventory page in Defender for Cloud and filter to the AWS resource type that you're interested in.

:::image type="content" source="./media/quickstart-onboard-aws/aws-resource-types-in-inventory.png" alt-text="Screenshot of AWS options in the asset inventory page's resource type filter." lightbox="media/quickstart-onboard-aws/aws-resource-types-in-inventory.png":::

## Learn more

Check out the following blogs:

- [Ignite 2021: Microsoft Defender for Cloud news](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/ignite-2021-microsoft-defender-for-cloud-news/ba-p/2882807)
- [Security posture management and server protection for AWS and GCP](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/security-posture-management-and-server-protection-for-aws-and/ba-p/3271388)

## Clean up resources

There's no need to clean up any resources for this article.

## Next steps

Connecting your AWS account is part of the multicloud experience available in Microsoft Defender for Cloud:

- [Protect all of your resources with Defender for Cloud](enable-all-plans.md).
- Set up your [on-premises machines](quickstart-onboard-machines.md) and [GCP projects](quickstart-onboard-gcp.md).
- Get answers to [common questions](faq-general.yml) about onboarding your AWS account.
- [Troubleshoot your multicloud connectors](troubleshooting-guide.md#troubleshooting-the-native-multicloud-connector).

