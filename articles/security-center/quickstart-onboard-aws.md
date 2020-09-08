---
title: Connect your AWS account to Azure Security Center
description: Monitoring your AWS resources from Azure Security Center
author: memildin
ms.author: memildin
ms.date: 9/12/2020
ms.topic: how-to
ms.service: security-center
manager: rkarlin

---

#  Connect your AWS accounts to Azure Security Center

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same.

Azure Security Center protects workloads in Azure, Amazon Web Services (AWS), and Google Cloud Platform (GCP).

When you onboard your AWS account into Security Center you'll benefit from having a single security solution that provides visibility and protection across all major cloud environments, as well as the following:

- Detection of security misconfigurations
- A single view showing Security Center recommendations and AWS Security Hub findings
- Incorporation of your AWS resources into Security Center's secure score calculations
- Regulatory compliance assessments of your AWS resources


## Availability

|Aspect|Details|
|----|:----|
|Release state:|Preview|
|Pricing:|Requires [Azure Defender for servers](defender-for-servers-intro.md)|
|Required roles and permissions:|**Owner** or **Contributor** on the relevant Azure Subscription|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![No](./media/icons/no-icon.png) National/Sovereign (US Gov, China Gov, Other Gov)|
|||


## What's involved in connecting AWS to Security Center?

Connecting your AWS accounts requires [Azure Defender for servers](defender-for-servers-intro.md). 

**Azure Defender for servers** deploys the Log Analytics agent to your AWS instances. With the help of [Azure Arc](../azure-arc/servers/overview.md), this provides Security Center features such as:

- Automatic agent provisioning
- Policy management
- Vulnerability management
- Embedded Endpoint Detection and Response (EDR)


> [!NOTE]
> AWS Systems Manager is required for automating tasks across your AWS resources. Ensure this is setup before configuring Security Center to monitor your EC2 instances. 
> 
> If your EC2 instances don't have the SSM Agent, follow the relevant instructions from Amazon:
>
> * [Installing and Configuring SSM Agent on Windows Instances](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-ssm-win.html)
> * [Installing and Configuring SSM Agent on Amazon EC2 Linux Instances](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-ssm-agent.html)

1. From your Amazon Web Services console, under **Security, Identity & Compliance**, click **IAM**.
1. ![AWS console's IAM settings option](./media/workload-protection-aws-ec2-instances/awsec2-monitoring-awsconsole-iam-option.png)
1. Open the **Users** tab and click **Add user**.
1. In the Details step, enter a username for Cloud App Security and ensure that you select **Programmatic access** for the AWS Access Type. 
1. Click **Next Permissions**
1. Click **Attach existing policies directly** and apply the  AmazonEC2RoleforSSM and SecurityAudit policies.
    ![Configuring the AWS IAM user permissions](./media/workload-protection-aws-ec2-instances/awsec2-monitoring-attach-existing-policies.png)
1. Click **Next: Tags**. Optionally add tags. Adding Tags to the user doesn't affect the connection.
1. Click **Review**.
1. Review the summary and click **Create user**.
1. Save the automatically generated **Access key ID** and **Secret access key** for later.




## Monitoring your AWS resources

The overview has


## Next steps

More stuff