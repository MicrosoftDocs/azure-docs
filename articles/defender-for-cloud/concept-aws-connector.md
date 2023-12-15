---
title: Defender for Cloud's AWS connector
description: Conceptual information pulled from AWS connector article.
ms.topic: tutorial
ms.date: 06/29/2023
---

# Defender for Cloud's AWS connector

To protect your AWS-based resources, you must [connect your AWS account](quickstart-onboard-aws.md) using the built-in connector. The connector provides an agentless connection to your AWS account that you can extend with Defender for Cloud's Defender plans to secure your AWS resources:

- [**Cloud Security Posture Management (CSPM)**](overview-page.md) assesses your AWS resources according to AWS-specific security recommendations and reflects your security posture in your secure score. The [asset inventory](asset-inventory.md) gives you one place to see all of your protected AWS resources. The [regulatory compliance dashboard](regulatory-compliance-dashboard.md) shows your compliance with built-in standards specific to AWS, including AWS CIS, AWS PCI DSS, and AWS Foundational Security Best Practices.

- [**Microsoft Defender for Servers**](defender-for-servers-introduction.md) brings threat detection and advanced defenses to [supported Windows and Linux EC2 instances](supported-machines-endpoint-solutions-clouds-servers.md?tabs=tab/features-multicloud).
    
- [**Microsoft Defender for Containers**](defender-for-containers-introduction.md) brings threat detection and advanced defenses to [supported Amazon EKS clusters](supported-machines-endpoint-solutions-clouds-containers.md).

- [**Microsoft Defender for SQL**](defender-for-sql-introduction.md) brings threat detection and advanced defenses to your SQL Servers running on AWS EC2, AWS RDS Custom for SQL Server.

The retired **Classic cloud connector** - Requires you to configure your AWS account to create a user that Defender for Cloud can use to connect to your AWS environment. The classic connector is only available to customers who have previously connected AWS accounts with it. 

> [!NOTE]
> If you are connecting an AWS account that was previously connected with the classic connector, you must [remove them](how-to-use-the-classic-connector.md#remove-classic-aws-connectors) first. Using an AWS account that is connected by both the classic and native connectors can produce duplicate recommendations.

## AWS authentication process

Federated authentication is used between Microsoft Defender for Cloud and AWS. All of the resources related to the authentication are created as a part of the CloudFormation template deployment, including:

- An identity provider (OpenID connect) 
- Identity and Access Management (IAM) roles with a federated principal (connected to the identity providers).

The architecture of the authentication process across clouds is as follows:

:::image type="content" source="media/quickstart-onboard-aws/architecture-authentication-across-clouds.png" alt-text="Diagram showing architecture of authentication process across clouds." lightbox="media/quickstart-onboard-aws/architecture-authentication-across-clouds.png":::

1. Microsoft Defender for Cloud CSPM service acquires a Microsoft Entra token with a validity life time of 1 hour that is signed by the Microsoft Entra ID using the RS256 algorithm. 

1. The Microsoft Entra token is exchanged with AWS short living credentials and Defender for Cloud's CSPM service assumes the CSPM IAM role (assumed with web identity).

1. Since the principle of the role is a federated identity as defined in a trust relationship policy, the AWS identity provider validates the Microsoft Entra token against the Microsoft Entra ID through a process that includes:

    - audience validation
    - signing of the token
    - certificate thumbprint

 1.  The Microsoft Defender for Cloud CSPM role is assumed only after the validation conditions defined at the trust relationship have been met. The conditions defined for the role level are used for validation within AWS and allows only the Microsoft Defender for Cloud CSPM application (validated audience) access to the specific role (and not any other Microsoft token).

1. After the Microsoft Entra token validated by the AWS identity provider, the AWS STS exchanges the token with AWS short-living credentials which CSPM service uses to scan the AWS account.

## Native connector plan requirements

Each plan has its own requirements for the native connector.

### Defender for Containers plan

- At least one Amazon EKS cluster with permission to access to the EKS K8s API server. If you need to create a new EKS cluster, follow the instructions in [Getting started with Amazon EKS – eksctl](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html).

- The resource capacity to create a new SQS queue, Kinesis Fire Hose delivery stream, and S3 bucket in the cluster's region.

### Defender for SQL plan

- Microsoft Defender for SQL enabled on your subscription. Learn how to [enable protection on all of your databases](quickstart-enable-database-protections.md).

- An active AWS account, with EC2 instances running SQL server or RDS Custom for SQL Server.

- Azure Arc for servers installed on your EC2 instances/RDS Custom for SQL Server.
     - (Recommended) Use the auto provisioning process to install Azure Arc on all of your existing and future EC2 instances.

        Auto provisioning managed by AWS Systems Manager (SSM) using the SSM agent. Some Amazon Machine Images (AMIs) already have the SSM agent preinstalled. If you already have the SSM agent preinstalled, the AMIs are listed in [AMIs with SSM Agent preinstalled](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent-technical-details.html#ami-preinstalled-agent). If your EC2 instances don't have the SSM Agent, you need to install it using either of the following relevant instructions from Amazon:
            
        - [Install SSM Agent for a hybrid environment (Windows)](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-managed-win.html)

        > [!NOTE]
        > To enable the Azure Arc auto-provisioning, you'll need **Owner** permission on the relevant Azure subscription.
        
- Other extensions should be enabled on the Arc-connected machines:
    - Microsoft Defender for Endpoint
    - VA solution (TVM/Qualys)
    - Log Analytics (LA) agent on Arc machines or Azure Monitor agent (AMA)

        Make sure the selected LA workspace has security solution installed. The LA agent and AMA are currently configured in the subscription level. All of your AWS accounts and GCP projects under the same subscription inherit the subscription settings for the LA agent and AMA.
        
        Learn more about [monitoring components](monitoring-components.md) for Defender for Cloud.

### Defender for Servers plan
    
- Microsoft Defender for Servers enabled on your subscription. Learn how to [enable plans](enable-all-plans.md).
    
- An active AWS account, with EC2 instances.
    
- Azure Arc for servers installed on your EC2 instances. 
    - (Recommended) Use the auto provisioning process to install Azure Arc on all of your existing and future EC2 instances.
            
        Auto provisioning managed by AWS Systems Manager (SSM) using the SSM agent. Some Amazon Machine Images (AMIs) already have the SSM agent preinstalled. If that is the case, their AMIs are listed in [AMIs with SSM Agent preinstalled](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent-technical-details.html#ami-preinstalled-agent). If your EC2 instances don't have the SSM Agent, you need to install it using either of the following relevant instructions from Amazon:

        - [Install SSM Agent for a hybrid environment (Windows)](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-managed-win.html)
        
        - [Install SSM Agent for a hybrid environment (Linux)](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-managed-linux.html)
        
        > [!NOTE]
        > To enable the Azure Arc auto-provisioning, you'll need an **Owner** permission on the relevant Azure subscription.
        
        - If you want to manually install Azure Arc on your existing and future EC2 instances, use the [EC2 instances should be connected to Azure Arc](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/231dee23-84db-44d2-bd9d-c32fbcfb42a3) recommendation to identify instances that don't have Azure Arc installed.
        
- Other extensions should be enabled on the Arc-connected machines:
    - Microsoft Defender for Endpoint
    - VA solution (TVM/Qualys)
    - Log Analytics (LA) agent on Arc machines or Azure Monitor agent (AMA)

        Make sure the selected LA workspace has security solution installed. The LA agent and AMA are currently configured in the subscription level. All of your AWS accounts and GCP projects under the same subscription inherit the subscription settings for the LA agent and AMA.

        Learn more about [monitoring components](monitoring-components.md) for Defender for Cloud.

        > [!NOTE]
        > Defender for Servers assigns tags to your AWS resources to manage the auto-provisioning process. You must have these tags properly assigned to your resources so that Defender for Cloud can manage your resources:
        **AccountId**, **Cloud**, **InstanceId**, **MDFCSecurityConnector**

## Learn more

You can check out the following blogs:

- [Ignite 2021: Microsoft Defender for Cloud news](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/ignite-2021-microsoft-defender-for-cloud-news/ba-p/2882807).
- [Security posture management and server protection for AWS and GCP](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/security-posture-management-and-server-protection-for-aws-and/ba-p/3271388)

## Next steps

Connecting your AWS account is part of the multicloud experience available in Microsoft Defender for Cloud.

- [Protect all of your resources with Defender for Cloud](enable-all-plans.md)
