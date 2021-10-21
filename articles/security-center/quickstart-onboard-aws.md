---
title: Connect your AWS account to Microsoft Defender for Cloud
description: Monitoring your AWS resources from Microsoft Defender for Cloud
author: memildin
ms.author: memildin
ms.date: 01/24/2021
ms.topic: quickstart
ms.service: security-center
manager: rkarlin
---

#  Connect your AWS accounts to Microsoft Defender for Cloud

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same.

Microsoft Defender for Cloud protects workloads in Azure, Amazon Web Services (AWS), and Google Cloud Platform (GCP).

Onboarding your AWS account into Defender for Cloud, integrates AWS Security Hub and Microsoft Defender for Cloud. Defender for Cloud thus provides visibility and protection across both of these cloud environments to provide:

- Automatic agent provisioning (Defender for Cloud uses [Azure Arc](../azure-arc/servers/overview.md) to deploy the Log Analytics agent to your AWS instances)
- Policy management
- Vulnerability management
- Embedded Endpoint Detection and Response (EDR)
- Detection of security misconfigurations
- A single view showing Defender for Cloud recommendations and AWS Security Hub findings
- Incorporation of your AWS resources into Defender for Cloud's secure score calculations
- Regulatory compliance assessments of your AWS resources

In the screenshot below you can see AWS accounts displayed in Defender for Cloud's overview dashboard.

:::image type="content" source="./media/quickstart-onboard-aws/aws-account-in-overview.png" alt-text="Three GCP projects listed on Defender for Cloud's overview dashboard" lightbox="./media/quickstart-onboard-gcp/gcp-account-in-overview.png":::

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|Requires [Microsoft Defender for servers](defender-for-servers-introduction.md)|
|Required roles and permissions:|**Owner** on the relevant Azure subscription<br>**Contributor** can also connect an AWS account if an owner provides the service principal details|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National/Sovereign (Azure Government, Azure China 21Vianet)|
|||



## Connect your AWS account

Follow the steps below to create your AWS cloud connector. 

### Step 1. Set up AWS Security Hub:

1. To view security recommendations for multiple regions, repeat the following steps for each relevant region.

    > [!IMPORTANT]
    > If you're using an AWS master account, repeat the following three steps to configure the master account and all connected member accounts across all relevant regions

    1. Enable [AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/gs-console.html).
    1. Enable [AWS Security Hub](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-settingup.html).
    1. Verify that there is data flowing to the Security Hub.

        When you first enable Security Hub, it might take several hours for data to be available.

### Step 2. Set up authentication for Defender for Cloud in AWS

There are two ways to allow Defender for Cloud to authenticate to AWS:

- **Create an IAM role for Defender for Cloud** - This is the most secure method and is recommended
- **AWS user for Defender for Cloud** - A less secure option if you don't have IAM enabled

#### Create an IAM role for Defender for Cloud
1. From your Amazon Web Services console, under **Security, Identity & Compliance**, select **IAM**.
    :::image type="content" source="./media/quickstart-onboard-aws/aws-identity-and-compliance.png" alt-text="AWS services.":::

1. Select **Roles** and **Create role**.
1. Select **Another AWS account**.
1. Enter the following details:

    - **Account ID** - enter the Microsoft Account ID (**158177204117**) as shown in the AWS connector page in Defender for Cloud.
    - **Require External ID** - should be selected
    - **External ID** - enter the subscription ID as shown in the AWS connector page in Defender for Cloud 

1. Select **Next**.
1. In the **Attach permission policies** section, select the following [AWS managed policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html):

    - SecurityAudit (`arn:aws:iam::aws:policy/SecurityAudit`)
    - AmazonSSMAutomationRole (`arn:aws:iam::aws:policy/service-role/AmazonSSMAutomationRole`)
    - AWSSecurityHubReadOnlyAccess (`arn:aws:iam::aws:policy/AWSSecurityHubReadOnlyAccess`)

1. Optionally add tags. Adding Tags to the user doesn't affect the connection.
1. Select **Next**.

1. In The Roles list, choose the role you created

1. Save the Amazon Resource Name (ARN) for later. 

#### Create an AWS user for Defender for Cloud 
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
1. Review the summary and click **Create user**.


### Step 3. Configure the SSM Agent

AWS Systems Manager is required for automating tasks across your AWS resources. If your EC2 instances don't have the SSM Agent, follow the relevant instructions from Amazon:

- [Installing and Configuring SSM Agent on Windows Instances](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-ssm-win.html)
- [Installing and Configuring SSM Agent on Amazon EC2 Linux Instances](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-ssm-agent.html)


### Step 4. Complete Azure Arc prerequisites
1. Make sure the appropriate [Azure resources providers](../azure-arc/servers/agent-overview.md#register-azure-resource-providers) are registered:
    - Microsoft.HybridCompute
    - Microsoft.GuestConfiguration

1. Create a Service Principal for onboarding at scale. As an **Owner** on the subscription you want to use for the onboarding, create a service principal for Azure Arc onboarding as described in [Create a Service Principal for onboarding at scale](../azure-arc/servers/onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale).


### Step 5. Connect AWS to Defender for Cloud

1. From Defender for Cloud's menu, select **Multi-cloud connectors**.
1. Select **Add AWS account**.
    :::image type="content" source="./media/quickstart-onboard-aws/add-aws-account.png" alt-text="Add AWS account button on Defender for Cloud's multi-cloud connectors page":::
1. Configure the options in the **AWS authentication** tab:
    1. Enter a **Display name** for the connector.
    1. Confirm that the subscription is correct. It is the subscription that will include the connector and AWS Security Hub recommendations.
    1. Depending on the authentication option, you chose in [Step 2. Set up authentication for Defender for Cloud in AWS](#step-2-set-up-authentication-for-defender-for-cloud-in-aws):
        - Select  **Assume Role** and paste the ARN from [Create an IAM role for Defender for Cloud](#create-an-iam-role-for-defender-for-cloud).
            :::image type="content" source="./media/quickstart-onboard-aws/paste-arn-in-portal.png" alt-text="Pasting the ARN file in the relevant field of the AWS connection wizard in the Azure portal.":::

            OR

        - Select **Credentials** and paste the **access key** and **secret key** from the .csv file you saved in [Create an AWS user for Defender for Cloud](#create-an-aws-user-for-defender-for-cloud).
1. Select **Next**.
1. Configure the options in the **Azure Arc Configuration** tab:

    Defender for Cloud discovers the EC2 instances in the connected AWS account and uses SSM to onboard them to Azure Arc. 

    > [!TIP]
    > For the list of supported operating systems, see [What operating systems for my EC2 instances are supported?](#what-operating-systems-for-my-ec2-instances-are-supported) in the FAQ.

    1. Select the **Resource Group** and **Azure Region** that the discovered AWS EC2s will be onboarded to in the selected subscription.
    1. Enter the **Service Principal ID** and **Service Principal Client Secret** for Azure Arc as described here [Create a Service Principal for onboarding at scale](../azure-arc/servers/onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale)
    1. If the machine is connecting to the internet via a proxy server, specify the proxy server IP address or the name and port number that the machine uses to communicate with the proxy server. Enter the value in the format ```http://<proxyURL>:<proxyport>```
    1. Select **Review + create**.

        Review the summary information

        The Tags sections will list all Azure Tags that will be automatically created for each onboarded EC2 with its own relevant details to easily recognize it in Azure. 

        Learn more about Azure Tags in [Use tags to organize your Azure resources and management hierarchy](../azure-resource-manager/management/tag-resources.md).

### Step 6. Confirmation

When the connector is successfully created, and AWS Security Hub has been configured properly:

- Defender for Cloud scans the environment for AWS EC2 instances, onboarding them to Azure Arc, enabling to install the Log Analytics agent and providing threat protection and security recommendations. 
- The ASC service scans for new AWS EC2 instances every 6 hours and onboards them according to the configuration.
- The AWS CIS standard will be shown in the Defender for Cloud's regulatory compliance dashboard.
- If Security Hub policy is enabled, recommendations will appear in the Defender for Cloud portal and the  regulatory compliance dashboard 5-10 minutes after onboard completes.
    :::image type="content" source="./media/quickstart-onboard-aws/aws-resources-in-recommendations.png" alt-text="AWS resources and recommendations in Defender for Cloud's recommendations page":::



## Monitoring your AWS resources

As shown above, Microsoft Defender for Cloud's security recommendations page displays your AWS resources together with your Azure and GCP resources for a true multi-cloud view.

To view all the active recommendations for your resources by resource type, use Defender for Cloud's asset inventory page and filter to the AWS resource type in which you're interested:

:::image type="content" source="./media/quickstart-onboard-aws/aws-resource-types-in-inventory.png" alt-text="Asset inventory page's resource type filter showing the AWS options"::: 


## FAQ - AWS in Defender for Cloud

### What operating systems for my EC2 instances are supported?

Supported OS for automatic onboarding to Azure Arc for AWS Machines

- Ubuntu 16.04 - SSM Agent is preinstalled, by default
- Ubuntu 18.04 - SSM Agent is preinstalled, by default
- Windows server - SSM Agent is preinstalled, by default
- CentOS Linux 7 – SSM should be installed manually or onboard separately
- SUSE Linux Enterprise Server (SLES) 15 (x64) -SSM should be installed manually or onboarded separately
- Red Hat Enterprise Linux (RHEL) 7 (x64) - SSM should be installed manually or onboarded separately


## Next steps

Connecting your AWS account is part of the multi-cloud experience available in Microsoft Defender for Cloud. For related information, see the following page:

- [Connect your GCP accounts to Microsoft Defender for Cloud](quickstart-onboard-gcp.md)
