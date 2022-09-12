---
title: Identify and remediate attack paths
description: Learn how to manage your attack path analysis and build queries to locate vulnerabilities in your multicloud environment.
ms.topic: how-to
ms.date: 09/12/2022
---

# Identify and remediate attack paths 

Defender for Cloud's contextual security capabilities assist security teams in the reduction of the risk of impactful breaches. Defender for Cloud uses environment context to perform a risk assessment to you security issues, by identifying the biggest security risk issues, while distinguishing them from less risky issues.

Attack Path Analysis helps you to address the security issues that pose immediate threats with the greatest potential of being exploited in your environment. Defender for Cloud analyzes which security issues are part of potential attack paths that attackers could use to breach your environment. It also highlights the security recommendations that need to be resolved in order to mitigate it.

## Availability

| Aspect | Details |
|--|--|
| Required plans | - Defender CSPM P1 enabled |
| Required roles and permissions: | - **Security Reader** <br> - **Security Admin** <br> - **Reader** <br> - **Contributor** <br> - **Owner** |
| Clouds: | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds (Azure, AWS) <br>:::image type="icon" source="./media/icons/no-icon.png"::: Commercial clouds (GCP) <br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet) |

## Investigate and remediate attack paths

Attack path analysis allows you to see the details of each node within your environment to locate any node that has vulnerabilities or misconfigurations. You can then remediate each recommendation in order to harden your environment.

**To investigate and remediate an attack path**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations** > **Attack paths**

1. Select an attack path.

    :::image type="content" source="media/how-to-manage-cloud-map/attack-path.png" alt-text="Screenshot that shows a sample of attack paths." lightbox="media/how-to-manage-cloud-map/attack-path.png":::

1. Select a node.

    :::image type="content" source="media/how-to-manage-cloud-map/node-select.png" alt-text="Screenshot of the attack path screen that shows you where the nodes are located for selection." lightbox="media/how-to-manage-cloud-map/node-select.png":::

1. Select **Insight** to view the associated insights for that node.

    :::image type="content" source="media/how-to-manage-cloud-map/insights.png" alt-text="Screenshot of the insights tab for a specific node.":::

1. Select **Recommendations**.

    :::image type="content" source="media/how-to-manage-cloud-map/attack-path-recommendations.png" alt-text="Screenshot that shows you where to select recommendations on the screen." lightbox="media/how-to-manage-cloud-map/attack-path-recommendations.png":::

1. Select a recommendation.

1. Follow the remediation steps to remediate the recommendation.

1. Select other nodes as necessary and view their insights and recommendations as necessary.

Once an attack path is resolved, it can take up to 24 hours for an attack path to be removed from the list.

## View all recommendations with attack path

Attack path analysis also gives you the ability to see all recommendations by attack path without having to check each node individually. You can resolve all recommendation without having to view each node individually.

**To resolve all recommendations**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations** > **Attack paths**

1. Select an attack path.

1. Select **Recommendations**.

    :::image type="content" source="media/how-to-manage-cloud-map/bulk-recommendations.png" alt-text="Screenshot that shows where to select on the screen to see the attack paths full list of recommendations.":::

1. Select a recommendation.

1. Follow the remediation steps to remediate the recommendation.

Once an attack path is resolved, it can take up to 24 hours for an attack path to be removed from the list.

## Attack path names and descriptions

A full list of attack paths and their descriptions.

### Azure VMs

| New Attack Path Type | Attack Path Display Name | Attack Path Description |
|--|--|--|
| Azure.VulnerableExposedVM | Internet exposed VM has high severity vulnerabilities | Virtual machine '\[MachineName]' is reachable from the internet and has high severity vulnerabilities \[RCE] |
| Azure.VulnerableExposedVMHasHighpermissionToSubscription | Internet exposed VM has high severity vulnerabilities and high permission to a subscription | Virtual machine '\[MachineName]' is reachable from the internet, has high severity vulnerabilities \[RCE] and \[IdentityDescription] with \[PermissionType] permission to subscription '\[SubscriptionName]' |
| Azure.VulnerableExposedVMHasReadpermissionTodata storeWithSensitiveData | Internet exposed VM has high severity vulnerabilities and read permission to a data store with sensitive data | Virtual machine '\[MachineName]' is reachable from the internet, has high severity vulnerabilities \[RCE] and \[IdentityDescription] with read permission to \[DatabaseType] '\[DatabaseName]' containing sensitive data |
| Azure.VulnerableExposedVMHasReadpermissionTodata store | Internet exposed VM has high severity vulnerabilities and read permission to a data store | Virtual machine '\[MachineName]' is reachable from the internet, has high severity vulnerabilities \[RCE] and \[IdentityDescription] with read permission to \[DatabaseType] '\[DatabaseName]' |
| Azure.VulnerableExposedVMHasReadpermissionToKV | Internet exposed VM has high severity vulnerabilities and read permission to a Key Vault | Virtual machine '\[MachineName]' is reachable from the internet, has high severity vulnerabilities \[RCE] and \[IdentityDescription] with read permission to Key Vault '\[KVName]' |
| Azure.VulnerableVMHasHighpermissionToSubscription | VM has high severity vulnerabilities and high permission to a subscription | Virtual machine '\[MachineName]' has high severity vulnerabilities \[RCE] and has high permission to subscription '\[SubscriptionName]' |
| Azure.VulnerableVMHasReadpermissionTodata storeWithSensitiveData | VM has high severity vulnerabilities and read permission to a data store with sensitive data | Virtual machine '\[MachineName]' has high severity vulnerabilities \[RCE] and \[IdentityDescription] with read permission to \[DatabaseType] '\[DatabaseName]' containing sensitive data |
| Azure.VulnerableVMHasReadpermissionToKV | VM has high severity vulnerabilities and read permission to a Key Vault | Virtual machine '\[MachineName]' has high severity vulnerabilities \[RCE] and \[IdentityDescription] with read permission to Key Vault '\[KVName]' |
| Azure.VulnerableVMHasReadpermissionTodata store | VM has high severity vulnerabilities and read permission to a data store | Virtual machine '\[MachineName]' has high severity vulnerabilities \[RCE] and \[IdentityDescription] with read permission to \[DatabaseType] '\[DatabaseName]' |

### AWS VMs

| New Attack Path Type | Attack Path Display Name	| Attack Path Description |
|--|--|--|
| AWS.VulnerableExposedEC2InstanceHasHighpermissionToAccount | Internet exposed EC2 instance has high severity vulnerabilities and high permission to an account | AWS EC2 instance '[EC2Name]' is reachable from the internet, has high severity vulnerabilities[RCE] and has '[permission]' permission to account '[AccountName]' |
| AWS.VulnerableExposedEC2InstanceHasReadpermissionToDB | Internet exposed EC2 instance has high severity vulnerabilities and read permission to a DB | AWS EC2 instance '[MachineName]' is reachable from the internet, has high severity vulnerabilities[RCE] and has '[permission]' permission to DB '[DatabaseName]'|
|  AWS.VulnerableExposedEC2InstanceHasReadpermissionToS3Bucket | Internet exposed EC2 instance has high severity vulnerabilities and read permission to S3 bucket | Option 1 <br> AWS EC2 instance '[MachineName]' is reachable from the internet, has high severity vulnerabilities[RCE] and has IAM role attached with '[Rolepermission]' permission via IAM policy to S3 bucket '[BucketName]' <br> <br> Option 2 <br> AWS EC2 instance '[MachineName]' is reachable from the internet, has high severity vulnerabilities[RCE] and has IAM role attached with '[S3permission]' permission via bucket policy to S3 bucket '[BucketName]' <br> <br> Option 3 <br> AWS EC2 instance '[MachineName]' is reachable from the internet, has high severity vulnerabilities[RCE] and has IAM role attached with '[Rolepermission]' permission via IAM policy and '[S3permission]' permission via bucket policy to S3 bucket '[BucketName]'|
| 
## Next Steps
