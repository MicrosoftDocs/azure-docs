---
title: Connect your AWS account to Defender for Cloud
description: Defend your AWS resources with Microsoft Defender for Cloud
ms.topic: install-set-up-deploy
ms.date: 06/28/2023
---

# Connect your AWS accounts to Microsoft Defender for Cloud

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same. Microsoft Defender for Cloud protects workloads in Amazon Web Services (AWS), but you need to set up the connection between them to your Azure subscription.

> [!NOTE]
> If you are connecting an AWS account that was previously connected with the classic connector, you must [remove them](how-to-use-the-classic-connector.md#remove-classic-aws-connectors) first. Using an AWS account that is connected by both the classic and native connector can produce duplicate recommendations.

This screenshot shows AWS accounts displayed in Defender for Cloud's [overview dashboard](overview-page.md).

:::image type="content" source="./media/quickstart-onboard-aws/aws-account-in-overview.png" alt-text="Four AWS projects listed on Defender for Cloud's overview dashboard" lightbox="./media/quickstart-onboard-aws/aws-account-in-overview.png":::

You can learn more by watching this video from the Defender for Cloud in the Field video series: 
- [AWS connector](episode-one.md)

For a reference list of all the recommendations Defender for Cloud can provide for AWS resources, see [Security recommendations for AWS resources - a reference guide](recommendations-reference-aws.md).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [Set up Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- Access to an AWS account.

- Required roles and permissions: **Contributor** permission for the relevant Azure subscription. <br> **Administrator** on the AWS account.

> [!NOTE]
> The AWS connector is not available on the national government clouds (Azure Government, Azure China 21Vianet).

- **To enable the Defender for Containers plan**, you need:
  - At least one Amazon EKS cluster with permission to access to the EKS K8s API server. If you need to create a new EKS cluster, follow the instructions in [Getting started with Amazon EKS – eksctl](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html).
  - The resource capacity to create a new SQS queue, Kinesis Fire Hose delivery stream, and S3 bucket in the cluster's region.

- **To enable the Defender for SQL plan**, you need:

  - Microsoft Defender for SQL enabled on your subscription. Learn how to [protect your databases](tutorial-enable-databases-plan.md).

    - An active AWS account, with EC2 instances running SQL server or RDS Custom for SQL Server.

    - Azure Arc for servers installed on your EC2 instances/RDS Custom for SQL Server.
      - (Recommended) Use the auto provisioning process to install Azure Arc on all of your existing and future EC2 instances.

          Auto provisioning, which is managed by AWS Systems Manager (SSM) using the SSM agent. Some Amazon Machine Images (AMIs) already have the SSM agent preinstalled. If you already have the SSM agent preinstalled, the AMIs are listed in [AMIs with SSM Agent preinstalled](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent-technical-details.html#ami-preinstalled-agent). If your EC2 instances don't have the SSM Agent, you need to install it using either of the following relevant instructions from Amazon:
            - [Install SSM Agent for a hybrid environment (Windows)](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-managed-win.html)
            Ensure that your SSM agent has the managed policy ["AmazonSSMManagedInstanceCore"](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html) that enables AWS Systems Manager service core functionality.

        > [!NOTE]
        > To enable the Azure Arc auto-provisioning, you'll need **Owner** permission on the relevant Azure subscription.

    - Other extensions should be enabled on the Arc-connected machines:
      - Microsoft Defender for Endpoint
      - VA solution (TVM/Qualys)
      - Log Analytics (LA) agent on Arc machines or Azure Monitor agent (AMA)

           Make sure the selected LA workspace has security solution installed. The LA agent and AMA are currently configured in the subscription level. All of your AWS accounts and GCP projects under the same subscription inherits the subscription settings for the LA agent and AMA.

        Learn more about [monitoring components](monitoring-components.md) for Defender for Cloud.

- **To enable the Defender for Servers plan**, you need:

  - Microsoft Defender for Servers enabled on your subscription. Learn how to enable [Defender for Servers](tutorial-enable-servers-plan.md).

    - An active AWS account, with EC2 instances.

    - Azure Arc for servers installed on your EC2 instances.
      - (Recommended) Use the auto provisioning process to install Azure Arc on all of your existing and future EC2 instances.

           Auto provisioning, which is managed by AWS Systems Manager (SSM) using the SSM agent. Some Amazon Machine Images (AMIs) already have the SSM agent preinstalled. If that is the case, their AMIs are listed in [AMIs with SSM Agent preinstalled](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent-technical-details.html#ami-preinstalled-agent). If your EC2 instances don't have the SSM Agent, you need to install it using either of the following relevant instructions from Amazon:
            - [Install SSM Agent for a hybrid environment (Windows)](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-managed-win.html)
            - [Install SSM Agent for a hybrid environment (Linux)](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-managed-linux.html)
            Ensure that your SSM agent has the managed policy ["AmazonSSMManagedInstanceCore"](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html) that enables AWS Systems Manager service core functionality.

        > [!NOTE]
        > To enable the Azure Arc auto-provisioning, you need an **Owner** permission on the relevant Azure subscription.

        - If you want to manually install Azure Arc on your existing and future EC2 instances, use the [EC2 instances should be connected to Azure Arc](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/231dee23-84db-44d2-bd9d-c32fbcfb42a3) recommendation to identify instances that don't have Azure Arc installed.

    - Other extensions should be enabled on the Arc-connected machines:
      - Microsoft Defender for Endpoint
      - VA solution (TVM/Qualys)
      - Log Analytics (LA) agent on Arc machines or Azure Monitor agent (AMA)

           Make sure the selected LA workspace has security solution installed. The LA agent and AMA are currently configured in the subscription level. All of your AWS accounts and GCP projects under the same subscription inherits the subscription settings for the LA agent and AMA.

        Learn more about [monitoring components](monitoring-components.md) for Defender for Cloud.

        > [!NOTE]
        > Defender for Servers assigns tags to your AWS resources to manage the auto-provisioning process. You must have these tags properly assigned to your resources so that Defender for Cloud can manage your resources:
        **AccountId**, **Cloud**, **InstanceId**, **MDFCSecurityConnector**

## Connect your AWS account

**To connect your AWS account to Defender for Cloud**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Defender for Cloud** > **Environment settings**.

1. Select **Add environment** > **Amazon Web Services**.

    :::image type="content" source="media/quickstart-onboard-aws/add-aws-account-environment-settings.png" alt-text="Screenshot of connecting an AWS account to an Azure subscription." lightbox="media/quickstart-onboard-aws/add-aws-account-environment-settings.png":::

1. Enter the details of the AWS account, including the location where you store the connector resource.

    :::image type="content" source="media/quickstart-onboard-aws/add-aws-account-details.png" alt-text="Screenshot of step 1 of the add AWS account wizard: Enter the account details." lightbox="media/quickstart-onboard-aws/add-aws-account-details.png":::

   (Optional) Select **Management account** to create a connector to a management account. Connectors are created for each member account discovered under the provided management account. Autoprovisioning is enabled for all of the newly onboarded accounts.

1. Select **Next: Select plans**.

    > [!NOTE]
    > Each plan has its own requirements for permissions, and might incur charges. Learn more about [each plan's requirements](concept-aws-connector.md#native-connector-plan-requirements) and their [prices](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h).

    :::image type="content" source="media/quickstart-onboard-aws/add-aws-account-plans-selection.png" alt-text="Screenshot of the select plans tab where you can choose which Defender for Cloud plans to enable for your AWS account." lightbox="media/quickstart-onboard-aws/add-aws-account-plans-selection.png":::

    > [!IMPORTANT]
    > To present the current status of your recommendations, the CSPM plan queries the AWS resource APIs several times a day. These read-only API calls incur no charges, but they *are* registered in CloudTrail if you've enabled a trail for read events. As explained in [the AWS documentation](https://aws.amazon.com/cloudtrail/pricing/), there are no additional charges for keeping one trail. If you're exporting the data out of AWS (for example, to an external SIEM), this increased volume of calls might also increase ingestion costs. In such cases, We recommend filtering out the read-only calls from the Defender for Cloud user or role ARN: `arn:aws:iam::[accountId]:role/CspmMonitorAws` (this is the default role name, confirm the role name configured on your account).

    - By default the **Servers** plan is set to **On**. This is necessary to extend Defender for server's coverage to your AWS EC2. Ensure you've fulfilled the [network requirements for Azure Arc](../azure-arc/servers/network-requirements.md?tabs=azure-cloud).

        - (Optional) Select **Configure**, to edit the configuration as required.

    > [!NOTE]
    > The respective Azure Arc servers for EC2 instances or GCP virtual machines that no longer exist (and the respective Azure Arc servers with a status of ["Disconnected" or "Expired"](/azure/azure-arc/servers/overview)) will be removed after 7 days. This process removes irrelevant Azure Arc entities, ensuring only Azure Arc servers related to existing instances are displayed.

    - By default the **Containers** plan is set to **On**. This is necessary to have Defender for Containers protect your AWS EKS clusters. Ensure you've fulfilled the [network requirements](./defender-for-containers-enable.md?pivots=defender-for-container-eks&source=docs&tabs=aks-deploy-portal%2ck8s-deploy-asc%2ck8s-verify-asc%2ck8s-remove-arc%2caks-removeprofile-api#network-requirements) for the Defender for Containers plan.

        > [!Note]
        > Azure Arc-enabled Kubernetes, the Defender Arc extension, and the Azure Policy Arc extension should be installed. Use the dedicated Defender for Cloud recommendations to deploy the extensions (and Arc, if necessary) as explained in [Protect Amazon Elastic Kubernetes Service clusters](defender-for-containers-enable.md?tabs=defender-for-container-eks).

        - (Optional) Select **Configure**, to edit the configuration as required. If you choose to disable this configuration, the `Threat detection (control plane)` feature is disabled. Learn more about the [feature availability](supported-machines-endpoint-solutions-clouds-containers.md).

    - By default the **Databases** plan is set to **On**. This is necessary to extend Defender for SQL's coverage to your AWS EC2 and RDS Custom for SQL Server.

        - (Optional) Select **Configure**, to edit the configuration as required. We recommend you leave it set to the default configuration. 

1. Select **Next: Configure access**.

1. Select **Click to download the CloudFormation template**, to download the CloudFormation template.

    :::image type="content" source="media/quickstart-onboard-aws/download-cloudformation-template.png" alt-text="Screenshot that shows you where to select on the screen to download the CloudFormation template." lightbox="media/quickstart-onboard-aws/download-cloudformation-template.png":::

    - Default access - Allows Defender for Cloud to scan your resources and automatically include future capabilities.
    - Least privileged access - Grants Defender for Cloud access only to the current permissions needed for the selected plans. If you select the least privileged permissions, you receive notifications on any new roles and permissions that are required to get full functionality on the connector health section.

    b. Choose deployment method: **AWS CloudFormation** or **Terraform**.

    :::image type="content" source="media/quickstart-onboard-aws/aws-configure-access.png" alt-text="Screenshot showing the configure access and its deployment options and instructions.":::

1. Follow the on-screen instructions for the selected deployment method to complete the required dependencies on AWS. If you're onboarding a management account, you need to run the CloudFormation template both as Stack and as StackSet. Connectors will be created for the member accounts up to 24 hours after the onboarding.

1. Select **Next: Review and generate**.

1. Select **Create**.

Defender for Cloud immediately starts scanning your AWS resources and you see security recommendations within a few hours. For a reference list of all the recommendations Defender for Cloud can provide for AWS resources, see [Security recommendations for AWS resources - a reference guide](recommendations-reference-aws.md).

## Deploy a CloudFormation template to your AWS account

As part of connecting an AWS account to Microsoft Defender for Cloud, a CloudFormation template should be deployed to the AWS account. This CloudFormation template creates all of the required resources necessary for Microsoft Defender for Cloud to connect to the AWS account. 

The CloudFormation template should be deployed using Stack (or StackSet if you have a management account). 

The Stack creation wizard offers the following options when you deploy the CloudFormation template: 

:::image type="content" source="media/quickstart-onboard-aws/cloudformation-template.png" alt-text="Screenshot showing stack creation wizard." lightbox="media/quickstart-onboard-aws/cloudformation-template.png"::: 

1. **Amazon S3 URL** – upload the downloaded CloudFormation template to your own S3 bucket with your own security configurations. Enter the URL to the S3 bucket in the AWS deployment wizard. 

1. **Upload a template file** – AWS automatically creates an S3 bucket that the CloudFormation template is saved to. The automation for the S3 bucket has a security misconfiguration that causes the `S3 buckets should require requests to use Secure Socket Layer` recommendation to appear. You can remediate this recommendation by applying the following policy: 

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

## Monitor your AWS resources

Defender for Cloud's security recommendations page displays your AWS resources. You can use the environments filter to enjoy Defender for Cloud's multicloud capabilities.

To view all the active recommendations for your resources by resource type, use Defender for Cloud's asset inventory page and filter to the AWS resource type in which you're interested:

:::image type="content" source="./media/quickstart-onboard-aws/aws-resource-types-in-inventory.png" alt-text="Screenshot of the asset inventory page's resource type filter showing the AWS options." lightbox="media/quickstart-onboard-aws/aws-resource-types-in-inventory.png":::

## Learn more

You can check out the following blogs:

- [Ignite 2021: Microsoft Defender for Cloud news](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/ignite-2021-microsoft-defender-for-cloud-news/ba-p/2882807).
- [Security posture management and server protection for AWS and GCP](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/security-posture-management-and-server-protection-for-aws-and/ba-p/3271388)

## Clean up resources

There's no need to clean up any resources for this tutorial.

## Next steps

Connecting your AWS account is part of the multicloud experience available in Microsoft Defender for Cloud.

- [Protect all of your resources with Defender for Cloud](enable-all-plans.md)

- Set up your [on-premises machines](quickstart-onboard-machines.md), [GCP projects](quickstart-onboard-gcp.md).
- Check out [common questions](faq-general.yml) about onboarding your AWS account.
- [Troubleshoot your multicloud connectors](troubleshooting-guide.md#troubleshooting-the-native-multicloud-connector)
