---
title: Amazon S3 multi-cloud scanning connector for Microsoft Purview
description: This how-to guide describes details of how to scan Amazon S3 buckets in Microsoft Purview.
author: batamig
ms.author: bagol
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 12/07/2021
ms.custom: references_regions
# Customer intent: As a security officer, I need to understand how to use the Microsoft Purview connector for Amazon S3 service to set up, configure, and scan my Amazon S3 buckets.
---


# Amazon S3 Multi-Cloud Scanning Connector for Microsoft Purview

The Multi-Cloud Scanning Connector for Microsoft Purview allows you to explore your organizational data across cloud providers, including Amazon Web Services in addition to Azure storage services.

This article describes how to use Microsoft Purview to scan your unstructured data currently stored in Amazon S3 standard buckets, and discover what types of sensitive information exists in your data. This how-to guide also describes how to identify the Amazon S3 Buckets where the data is currently stored for easy information protection and data compliance.

For this service, use Microsoft Purview to provide a Microsoft account with secure access to AWS, where the Multi-Cloud Scanning Connector for Microsoft Purview will run. The Multi-Cloud Scanning Connector for Microsoft Purview uses this access to your Amazon S3 buckets to read your data, and then reports the scanning results, including only the metadata and classification, back to Azure. Use the Microsoft Purview classification and labeling reports to analyze and review your data scan results.

> [!IMPORTANT]
> The Multi-Cloud Scanning Connector for Microsoft Purview is a separate add-on to Microsoft Purview. The terms and conditions for the Multi-Cloud Scanning Connector for Microsoft Purview are contained in the agreement under which you obtained Microsoft Azure Services. For more information, see Microsoft Azure Legal Information at https://azure.microsoft.com/support/legal/.
>

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|
| Yes | Yes | Yes | Yes | Yes | No | Limited** | No |

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md) 


## Microsoft Purview scope for Amazon S3

We currently don't support ingestion private endpoints that work with your AWS sources.

For more information about Microsoft Purview limits, see:

- [Manage and increase quotas for resources with Microsoft Purview](how-to-manage-quotas.md)
- [Supported data sources and file types in Microsoft Purview](sources-and-scans.md)

### Storage and scanning regions

The Microsoft Purview connector for the Amazon S3 service is currently deployed in specific regions only. The following table maps the regions where your data is stored to the region where it would be scanned by Microsoft Purview.

> [!IMPORTANT]
> Customers will be charged for all related data transfer charges according to the region of their bucket.
>

| Storage region | Scanning region |
| ------------------------------- | ------------------------------------- |
| US East (Ohio)                  | US East (Ohio)                        |
| US East (N. Virginia)           | US East (N. Virginia)                       |
| US West (N. California)         | US West (N. California)                        |
| US West (Oregon)                | US West (Oregon)                      |
| Africa (Cape Town)              | Europe (Frankfurt)                    |
| Asia Pacific (Hong Kong)        | Asia Pacific (Tokyo)                |
| Asia Pacific (Mumbai)           | Asia Pacific (Singapore)                |
| Asia Pacific (Osaka-Local)      | Asia Pacific (Tokyo)                 |
| Asia Pacific (Seoul)            | Asia Pacific (Tokyo)                 |
| Asia Pacific (Singapore)        | Asia Pacific (Singapore)                 |
| Asia Pacific (Sydney)           | Asia Pacific (Sydney)                  |
| Asia Pacific (Tokyo)            | Asia Pacific (Tokyo)                |
| Canada (Central)                | US East (Ohio)                        |
| China (Beijing)                 | Not supported                    |
| China (Ningxia)                 | Not supported                   |
| Europe (Frankfurt)              | Europe (Frankfurt)                    |
| Europe (Ireland)                | Europe (Ireland)                   |
| Europe (London)                 | Europe (London)                 |
| Europe (Milan)                  | Europe (Paris)                    |
| Europe (Paris)                  | Europe (Paris)                   |
| Europe (Stockholm)              | Europe (Frankfurt)                    |
| Middle East (Bahrain)           | Europe (Frankfurt)                    |
| South America (São Paulo)       | US East (Ohio)                        |
| | |

## Prerequisites

Ensure that you've performed the following prerequisites before adding your Amazon S3 buckets as Microsoft Purview data sources and scanning your S3 data.

> [!div class="checklist"]
> * You need to be a Microsoft Purview Data Source Admin.
> * [Create a Microsoft Purview account](#create-a-microsoft-purview-account) if you don't yet have one
> * [Create a new AWS role for use with Microsoft Purview](#create-a-new-aws-role-for-microsoft-purview)
> * [Create a Microsoft Purview credential for your AWS bucket scan](#create-a-microsoft-purview-credential-for-your-aws-s3-scan)
> * [Configure scanning for encrypted Amazon S3 buckets](#configure-scanning-for-encrypted-amazon-s3-buckets), if relevant
> * Make sure that your bucket policy does not block the connection. For more information, see [Bucket policy requirements](#confirm-your-bucket-policy-access) and [SCP policy requirements](#confirm-your-scp-policy-access). For these items, you may need to consult with an AWS expert to ensure that your policies allow required access.
> * When adding your buckets as Microsoft Purview resources, you'll need the values of your [AWS ARN](#retrieve-your-new-role-arn), [bucket name](#retrieve-your-amazon-s3-bucket-name), and sometimes your [AWS account ID](#locate-your-aws-account-id).


### Create a Microsoft Purview account

- **If you already have a Microsoft Purview account,** you can continue with the configurations required for AWS S3 support. Start with [Create a Microsoft Purview credential for your AWS bucket scan](#create-a-microsoft-purview-credential-for-your-aws-s3-scan).

- **If you need to create a Microsoft Purview account,** follow the instructions in [Create a Microsoft Purview account instance](create-catalog-portal.md). After creating your account, return here to complete configuration and begin using Microsoft Purview connector for Amazon S3.

### Create a new AWS role for Microsoft Purview

The Microsoft Purview scanner is deployed in a Microsoft account in AWS. To allow the Microsoft Purview scanner to read your S3 data, you must create a dedicated role in the AWS portal, in the IAM area, to be used by the scanner.

This procedure describes how to create the AWS role, with the required Microsoft Account ID and External ID from Microsoft Purview, and then enter the Role ARN value in Microsoft Purview.


**To locate your Microsoft Account ID and External ID**:

1. In Microsoft Purview, go to the **Management Center** > **Security and access** > **Credentials**.

1. Select **New** to create a new credential.

    In the **New credential** pane that appears on the right, in the **Authentication method** dropdown, select **Role ARN**.

    Then copy the **Microsoft account ID** and **External ID** values that appear to a separate file, or have them handy for pasting into the relevant field in AWS. For example:

    [ ![Locate your Microsoft account ID and External ID values.](./media/register-scan-amazon-s3/locate-account-id-external-id.png) ](./media/register-scan-amazon-s3/locate-account-id-external-id.png#lightbox)


**To create your AWS role for Microsoft Purview**:

1.	Open your **Amazon Web Services** console, and under **Security, Identity, and Compliance**, select **IAM**.

1. Select **Roles** and then **Create role**.

1. Select **Another AWS account**, and then enter the following values:

    |Field  |Description  |
    |---------|---------|
    |**Account ID**     |    Enter your Microsoft Account ID. For example: `181328463391`     |
    |**External ID**     |   Under options, select **Require external ID...**, and then enter your External ID in the designated field. <br>For example: `e7e2b8a3-0a9f-414f-a065-afaf4ac6d994`     |
    | | |

    For example:

    ![Add the Microsoft Account ID to your AWS account.](./media/register-scan-amazon-s3/aws-create-role-amazon-s3.png)

1. In the **Create role > Attach permissions policies** area, filter the permissions displayed to **S3**. Select **AmazonS3ReadOnlyAccess**, and then select **Next: Tags**.

    ![Select the ReadOnlyAccess policy for the new Amazon S3 scanning role.](./media/register-scan-amazon-s3/aws-permission-role-amazon-s3.png)

    > [!IMPORTANT]
    > The **AmazonS3ReadOnlyAccess** policy provides minimum permissions required for scanning your S3 buckets, and may include other permissions as well.
    >
    >To apply only the minimum permissions required for scanning your buckets, create a new policy with the permissions listed in [Minimum permissions for your AWS policy](#minimum-permissions-for-your-aws-policy), depending on whether you want to scan a single bucket or all the buckets in your account. 
    >
    >Apply your new policy to the role instead of **AmazonS3ReadOnlyAccess.**

1. In the **Add tags (optional)** area, you can optionally choose to create a meaningful tag for this new role. Useful tags enable you to organize, track, and control access for each role you create.

    Enter a new key and value for your tag as needed. When you're done, or if you want to skip this step, select **Next: Review** to review the role details and complete the role creation.

    ![Add a meaningful tag to organize, track, or control access for your new role.](./media/register-scan-amazon-s3/add-tag-new-role.png)

1. In the **Review** area, do the following:

    - In the **Role name** field, enter a meaningful name for your role
    - In the **Role description** box, enter an optional description to identify the role's purpose
    - In the **Policies** section, confirm that the correct policy (**AmazonS3ReadOnlyAccess**) is attached to the role.

    Then select **Create role** to complete the process. For example:

    ![Review details before creating your role.](./media/register-scan-amazon-s3/review-role.png)

**Extra required configurations**:

- For buckets that use **AWS-KMS** encryption, [special configuration](#configure-scanning-for-encrypted-amazon-s3-buckets) is required to enable scanning.

- Make sure that your bucket policy doesn't block the connection. For more information, see:

    - [Confirm your bucket policy access](#confirm-your-bucket-policy-access)
    - [Confirm your SCP policy access](#confirm-your-scp-policy-access)

### Create a Microsoft Purview credential for your AWS S3 scan

This procedure describes how to create a new Microsoft Purview credential to use when scanning your AWS buckets.

> [!TIP]
> If you're continuing directly on from [Create a new AWS role for Microsoft Purview](#create-a-new-aws-role-for-microsoft-purview), you may already have the **New credential** pane open in Microsoft Purview.
>
> You can also create a new credential in the middle of the process, while [configuring your scan](#create-a-scan-for-one-or-more-amazon-s3-buckets). In that case, in the **Credential** field, select **New**.
>

1. In Microsoft Purview, go to the **Management Center**, and under **Security and access**, select **Credentials**.

1. Select **New**, and in the **New credential** pane that appears on the right, use the following fields to create your Microsoft Purview credential:

    |Field |Description  |
    |---------|---------|
    |**Name**     |Enter a meaningful name for this credential.        |
    |**Description**     |Enter an optional description for this credential, such as `Used to scan the tutorial S3 buckets`         |
    |**Authentication method**     |Select **Role ARN**, since you're using a role ARN to access your bucket.         |
    |**Role ARN**     | Once you've [created your Amazon IAM role](#create-a-new-aws-role-for-microsoft-purview), navigate to your role in the AWS IAM area, copy the **Role ARN** value, and enter it here. For example: `arn:aws:iam::181328463391:role/S3Role`. <br><br>For more information, see [Retrieve your new Role ARN](#retrieve-your-new-role-arn). |
    | | |
    
    The **Microsoft account ID** and the **External ID** values are used when [creating your Role ARN in AWS.](#create-a-new-aws-role-for-microsoft-purview).

1. Select **Create** when you're done to finish creating the credential.

For more information about Microsoft Purview credentials, see [Credentials for source authentication in Microsoft Purview](manage-credentials.md).


### Configure scanning for encrypted Amazon S3 buckets

AWS buckets support multiple encryption types. For buckets that use **AWS-KMS** encryption, special configuration is required to enable scanning.

> [!NOTE]
> For buckets that use no encryption, AES-256 or AWS-KMS S3 encryption, skip this section and continue to [Retrieve your Amazon S3 bucket name](#retrieve-your-amazon-s3-bucket-name).
>

**To check the type of encryption used in your Amazon S3 buckets:**

1. In AWS, navigate to **Storage** > **S3** > and select **Buckets** from the menu on the left.

    ![Select the Amazon S3 Buckets tab.](./media/register-scan-amazon-s3/check-encryption-type-buckets.png)

1. Select the bucket you want to check. On the bucket's details page, select the **Properties** tab and scroll down to the **Default encryption** area.

    - If the bucket you selected is configured for anything but **AWS-KMS** encryption, including if default encryption for your bucket is **Disabled**, skip the rest of this procedure and continue with [Retrieve your Amazon S3 bucket name](#retrieve-your-amazon-s3-bucket-name).

    - If the bucket you selected is configured for **AWS-KMS** encryption, continue as described below to add a new policy that allows for scanning a bucket with custom **AWS-KMS** encryption.

    For example:

    ![View an Amazon S3 bucket configured with AWS-KMS encryption](./media/register-scan-amazon-s3/default-encryption-buckets.png)

**To add a new policy to allow for scanning a bucket with custom AWS-KMS encryption:**

1. In AWS, navigate to **Services** >  **IAM** >  **Policies**, and select **Create policy**.

1. On the **Create policy** > **Visual editor** tab, define your policy with the following values:

    |Field  |Description  |
    |---------|---------|
    |**Service**     |  Enter and select **KMS**.       |
    |**Actions**     | Under **Access level**, select **Write** to expand the **Write** section.<br>Once expanded, select only the **Decrypt** option.        |
    |**Resources**     |Select a specific resource or **All resources**.         |
    | | |

    When you're done, select **Review policy** to continue.

    ![Create a policy for scanning a bucket with AWS-KMS encryption.](./media/register-scan-amazon-s3/create-policy-kms.png)

1. On the **Review policy** page, enter a meaningful name for your policy and an optional description, and then select **Create policy**.

    The newly created policy is added to your list of policies.

1. Attach your new policy to the role you added for scanning.

    1. Navigate back to the **IAM** > **Roles** page, and select the role you added [earlier](#create-a-new-aws-role-for-microsoft-purview).

    1. On the **Permissions** tab, select **Attach policies**.

        ![On your role's Permissions tab, select Attach policies.](./media/register-scan-amazon-s3/iam-attach-policies.png)

    1. On the **Attach Permissions** page, search for and select the new policy you created above. Select **Attach policy** to attach your policy to the role.

        The **Summary** page is updated, with your new policy attached to your role.

        ![View an updated Summary page with the new policy attached to your role.](./media/register-scan-amazon-s3/attach-policy-role.png)

### Confirm your bucket policy access

Make sure that the S3 bucket [policy](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-iam-policies.html) doesn't block the connection:

1. In AWS, navigate to your S3 bucket, and then select the **Permissions** tab > **Bucket policy**.
1. Check the policy details to make sure that it doesn't block the connection from the Microsoft Purview scanner service.

### Confirm your SCP policy access

Make sure that there's no [SCP policy](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) that blocks the connection to the S3 bucket. 

For example, your SCP policy might block read API calls to the [AWS Region](#storage-and-scanning-regions) where your S3 bucket is hosted.

- Required API calls, which must be allowed by your SCP policy, include: `AssumeRole`, `GetBucketLocation`, `GetObject`, `ListBucket`, `GetBucketPublicAccessBlock`. 
- Your SCP policy must also allow calls to the **us-east-1** AWS Region, which is the default Region for API calls. For more information, see the [AWS documentation](https://docs.aws.amazon.com/general/latest/gr/rande.html).

Follow the [SCP documentation](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_create.html), review your organization’s SCP policies, and make sure all the [permissions required for the Microsoft Purview scanner](#create-a-new-aws-role-for-microsoft-purview) are available.


### Retrieve your new Role ARN

You'll need to record your AWS Role ARN and copy it in to Microsoft Purview when [creating a scan for your Amazon S3 bucket](#create-a-scan-for-one-or-more-amazon-s3-buckets).

**To retrieve your role ARN:**

1. In the AWS **Identity and Access Management (IAM)** > **Roles** area, search for and select the new role you [created for Microsoft Purview](#create-a-microsoft-purview-credential-for-your-aws-s3-scan).

1. On the role's **Summary** page, select the **Copy to clipboard** button to the right of the **Role ARN** value.

    ![Copy the role ARN value to the clipboard.](./media/register-scan-amazon-s3/aws-copy-role-purview.png)

In Microsoft Purview, you can edit your credential for AWS S3, and paste the retrieved role in the **Role ARN** field. For more information, see [Create a scan for one or more Amazon S3 buckets](#create-a-scan-for-one-or-more-amazon-s3-buckets).

### Retrieve your Amazon S3 bucket name

You'll need the name of your Amazon S3 bucket to copy it in to Microsoft Purview when [creating a scan for your Amazon S3 bucket](#create-a-scan-for-one-or-more-amazon-s3-buckets)

**To retrieve your bucket name:**

1. In AWS, navigate to **Storage** > **S3** > and select **Buckets** from the menu on the left.

    ![View the Amazon S3 Buckets tab.](./media/register-scan-amazon-s3/check-encryption-type-buckets.png)

1. Search for and select your bucket to view the bucket details page, and then copy the bucket name to the clipboard.

    For example:

    ![Retrieve and copy the S3 bucket URL.](./media/register-scan-amazon-s3/retrieve-bucket-url-amazon.png)

    Paste your bucket name in a secure file, and add an `s3://` prefix to it to create the value you'll need to enter when configuring your bucket as a Microsoft Purview account.

    For example: `s3://purview-tutorial-bucket`

> [!TIP]
> Only the root level of your bucket is supported as a Microsoft Purview data source. For example, the following URL, which includes a sub-folder is *not* supported: `s3://purview-tutorial-bucket/view-data`
>
> However, if you configure a scan for a specific S3 bucket, you can select one or more specific folders for your scan. For more information, see the step to [scope your scan](#create-a-scan-for-one-or-more-amazon-s3-buckets).
>

### Locate your AWS account ID

You'll need your AWS account ID to register your AWS account as a Microsoft Purview data source, together with all of its buckets.

Your AWS account ID is the ID you use to log in to the AWS console. You can also find it once you're logged in on the IAM dashboard, on the left under the navigation options, and at the top, as the numerical part of your sign-in URL:

For example:

![Retrieve your AWS account ID.](./media/register-scan-amazon-s3/aws-locate-account-id.png)


## Add a single Amazon S3 bucket as a Microsoft Purview account

Use this procedure if you only have a single S3 bucket that you want to register to Microsoft Purview as a data source, or if you have multiple buckets in your AWS account, but don't want to register all of them to Microsoft Purview.

**To add your bucket**:

1. In Microsoft Purview, go to the **Data Map** page, and select **Register** ![Register icon.](./media/register-scan-amazon-s3/register-button.png) > **Amazon S3** > **Continue**.

    ![Add an Amazon AWS bucket as a Microsoft Purview data source.](./media/register-scan-amazon-s3/add-s3-datasource-to-purview.png)

    > [!TIP]
    > If you have multiple [collections](manage-data-sources.md#manage-collections) and want to add your Amazon S3 to a specific collection, select the **Map view** at the top right, and then select the **Register** ![Register icon.](./media/register-scan-amazon-s3/register-button.png) button inside your collection.
    >

1. In the **Register sources (Amazon S3)** pane that opens, enter the following details:

    |Field  |Description  |
    |---------|---------|
    |**Name**     |Enter a meaningful name, or use the default provided.         |
    |**Bucket URL**     | Enter your AWS bucket URL, using the following syntax:   `s3://<bucketName>`     <br><br>**Note**: Make sure to use only the root level of your bucket. For more information, see [Retrieve your Amazon S3 bucket name](#retrieve-your-amazon-s3-bucket-name). |
    |**Select a collection** |If you selected to register a data source from within a collection, that collection already listed. <br><br>Select a different collection as needed, **None** to assign no collection, or **New** to create a new collection now. <br><br>For more information about Microsoft Purview collections, see [Manage data sources in Microsoft Purview](manage-data-sources.md#manage-collections).|
    | | |

    When you're done, select **Finish** to complete the registration.

Continue with [Create a scan for one or more Amazon S3 buckets.](#create-a-scan-for-one-or-more-amazon-s3-buckets).

## Add an AWS account as a Microsoft Purview account

Use this procedure if you have multiple S3 buckets in your Amazon account, and you want to register all of them  as Microsoft Purview data sources.

When [configuring your scan](#create-a-scan-for-one-or-more-amazon-s3-buckets), you'll be able to select the specific buckets you want to scan, if you don't want to scan all of them together.

**To add your Amazon account**:

1. In Microsoft Purview, go to the **Data Map** page, and select **Register** ![Register icon.](./media/register-scan-amazon-s3/register-button.png) > **Amazon accounts** > **Continue**.

    ![Add an Amazon account as a Microsoft Purview data source.](./media/register-scan-amazon-s3/add-s3-account-to-purview.png)

    > [!TIP]
    > If you have multiple [collections](manage-data-sources.md#manage-collections) and want to add your Amazon S3 to a specific collection, select the **Map view** at the top right, and then select the **Register** ![Register icon.](./media/register-scan-amazon-s3/register-button.png) button inside your collection.
    >

1. In the **Register sources (Amazon S3)** pane that opens, enter the following details:

    |Field  |Description  |
    |---------|---------|
    |**Name**     |Enter a meaningful name, or use the default provided.         |
    |**AWS account ID**     | Enter your AWS account ID. For more information, see [Locate your AWS account ID](#locate-your-aws-account-id)|
    |**Select a collection** |If you selected to register a data source from within a collection, that collection already listed. <br><br>Select a different collection as needed, **None** to assign no collection, or **New** to create a new collection now. <br><br>For more information about Microsoft Purview collections, see [Manage data sources in Microsoft Purview](manage-data-sources.md#manage-collections).|
    | | |

    When you're done, select **Finish** to complete the registration.

Continue with [Create a scan for one or more Amazon S3 buckets](#create-a-scan-for-one-or-more-amazon-s3-buckets).

## Create a scan for one or more Amazon S3 buckets

Once you've added your buckets as Microsoft Purview data sources, you can configure a scan to run at scheduled intervals or immediately.

1. Select the **Data Map** tab on the left pane in the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/), and then do one of the following:

    - In the **Map view**, select **New scan** ![New scan icon.](./media/register-scan-amazon-s3/new-scan-button.png) in your data source box.
    - In the **List view**, hover over the row for your data source, and select **New scan** ![New scan icon.](./media/register-scan-amazon-s3/new-scan-button.png).

1. On the **Scan...** pane that opens on the right, define the following fields and then select **Continue**:

    |Field  |Description  |
    |---------|---------|
    |**Name**     |  Enter a meaningful name for your scan or use the default.       |
    |**Type** |Displayed only if you've added your AWS account, with all buckets included. <br><br>Current options include only **All** > **Amazon S3**. Stay tuned for more options to select as Microsoft Purview's support matrix expands. |
    |**Credential**     |  Select a Microsoft Purview credential with your role ARN. <br><br>**Tip**: If you want to create a new credential at this time, select **New**. For more information, see [Create a Microsoft Purview credential for your AWS bucket scan](#create-a-microsoft-purview-credential-for-your-aws-s3-scan).     |
    | **Amazon S3**    |   Displayed only if you've added your AWS account, with all buckets included. <br><br>Select one or more buckets to scan, or **Select all** to scan all the buckets in your account.      |
    | | |

    Microsoft Purview automatically checks that the role ARN is valid, and that the buckets and objects within the buckets are accessible, and then continues if the connection succeeds.

    > [!TIP]
    > To enter different values and test the connection yourself before continuing, select **Test connection** at the bottom right before selecting **Continue**.
    >

1. <a name="scope-your-scan"></a>On the **Scope your scan** pane, select the specific buckets or folders you want to include in your scan.

    When creating a scan for an entire AWS account, you can select specific buckets to scan. When creating a scan for a specific AWS S3 bucket, you can select specific folders to scan.

1. On the **Select a scan rule set** pane, either select the **AmazonS3** default rule set, or select **New scan rule set** to  create a new custom rule set. Once you have your rule set selected, select **Continue**.

    If you select to create a new custom scan rule set, use the wizard to define the following settings:

    |Pane  |Description  |
    |---------|---------|
    |**New scan rule set** /<br>**Scan rule description**    |   Enter a meaningful name and an optional description for your rule set      |
    |**Select file types**     | Select all the file types you want to include in the scan, and then select **Continue**.<br><br>To add a new file type, select **New file type**, and define the following: <br>- The file extension you want to add <br>- An optional description  <br>- Whether the file contents have a custom delimiter, or are a system file type. Then, enter your custom delimiter, or select your system file type. <br><br>Select **Create** to create your custom file type.     |
    |**Select classification rules**     |   Navigate to and select the classification rules you want to run on your dataset.      |
    |     |         |

    Select **Create** when you're done to create your rule set.

1. On the **Set a scan trigger** pane, select one of the following, and then select **Continue**:

    - **Recurring** to configure a schedule for a recurring scan
    - **Once** to configure a scan that starts immediately

1. On the **Review your scan** pane, check your scanning details to confirm that they're correct, and then select **Save** or **Save and Run** if you selected **Once** in the previous pane.

    > [!NOTE]
    > Once started, scanning can take up to 24 hours to complete. You'll be able to review your **Insight Reports** and search the catalog 24 hours after you started each scan.
    >

For more information, see [Explore Microsoft Purview scanning results](#explore-microsoft-purview-scanning-results).

## Explore Microsoft Purview scanning results

Once a Microsoft Purview scan is complete on your Amazon S3 buckets, drill down in the Microsoft Purview **Data Map**  area to view the scan history.

Select a data source to view its details, and then select the **Scans** tab to view any currently running or completed scans.
If you've added an AWS account with multiple buckets, the scan history for each bucket is shown under the account.

For example:

![Show the AWS S3 bucket scans under your AWS account source.](./media/register-scan-amazon-s3/account-scan-history.png)

Use the other areas of Microsoft Purview to find out details about the content in your data estate, including your Amazon S3 buckets:

- **Search the Microsoft Purview data catalog,** and filter for a specific bucket. For example:

    ![Search the catalog for AWS S3 assets.](./media/register-scan-amazon-s3/search-catalog-screen-aws.png)

- **View Insight reports** to view statistics for the classification, sensitivity labels, file types, and more details about your content.

    All Microsoft Purview Insight reports include the Amazon S3 scanning results, along with the rest of the results from your Azure data sources. When relevant, another **Amazon S3** asset type was added to the report filtering options.

    For more information, see the [Understand Data Estate Insights in Microsoft Purview](concept-insights.md).

## Minimum permissions for your AWS policy

The default procedure for [creating an AWS role for Microsoft Purview](#create-a-new-aws-role-for-microsoft-purview) to use when scanning your S3 buckets uses the **AmazonS3ReadOnlyAccess** policy.

The **AmazonS3ReadOnlyAccess** policy provides minimum permissions required for scanning your S3 buckets, and may include other permissions as well.

To apply only the minimum permissions required for scanning your buckets, create a new policy with the permissions listed in the following sections, depending on whether you want to scan a single bucket or all the buckets in your account.

Apply your new policy to the role instead of **AmazonS3ReadOnlyAccess.**

### Individual buckets

When scanning individual S3 buckets, minimum AWS permissions include:

- `GetBucketLocation`
- `GetBucketPublicAccessBlock`
- `GetObject`
- `ListBucket`

Make sure to define your resource with the specific bucket name. 
For example:

```json
{
"Version": "2012-10-17",
"Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetBucketLocation",
                "s3:GetBucketPublicAccessBlock",
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::<bucketname>"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3::: <bucketname>/*"
        }
    ]
}
```

### All buckets in your account

When scanning all the buckets in your AWS account, minimum AWS permissions include:

- `GetBucketLocation`
- `GetBucketPublicAccessBlock`
- `GetObject`
- `ListAllMyBuckets`
- `ListBucket`.

Make sure to define your resource with a wildcard. For example:

```json
{
"Version": "2012-10-17",
"Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetBucketLocation",
                "s3:GetBucketPublicAccessBlock",
                "s3:GetObject",
                "s3:ListAllMyBuckets",
                "s3:ListBucket"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": "*"
        }
    ]
}
```

## Troubleshooting

Scanning Amazon S3 resources requires [creating a role in AWS IAM](#create-a-new-aws-role-for-microsoft-purview) to allow the Microsoft Purview scanner service running in a Microsoft account in AWS to read the data.

Configuration errors in the role can lead to connection failure. This section describes some examples of connection failures that may occur while setting up the scan, and the troubleshooting guidelines for each case.

If all of the items described in the following sections are properly configured, and scanning S3 buckets still fails with errors, contact Microsoft support.

> [!NOTE]
> For policy access issues, make sure that neither your bucket policy, nor your SCP policy are blocking access to your S3 bucket from Microsoft Purview.
>
>For more information, see [Confirm your bucket policy access](#confirm-your-bucket-policy-access) and [Confirm your SCP policy access](#confirm-your-scp-policy-access).
>
### Bucket is encrypted with KMS

Make sure that the AWS role has **KMS Decrypt** permissions. For more information, see [Configure scanning for encrypted Amazon S3 buckets](#configure-scanning-for-encrypted-amazon-s3-buckets).

### AWS role is missing an external ID

Make sure that the AWS role has the correct external ID:

1. In the AWS IAM area, select the **Role > Trust relationships** tab.
1. Follow the steps in [Create a new AWS role for Microsoft Purview](#create-a-new-aws-role-for-microsoft-purview) again to verify your details.

### Error found with the role ARN

This is a general error that indicates an issue when using the Role ARN. For example, you may want to troubleshoot as follows:

- Make sure that the AWS role has the required permissions to read the selected S3 bucket.  Required permissions include `AmazonS3ReadOnlyAccess` or the [minimum read permissions](#minimum-permissions-for-your-aws-policy), and `KMS Decrypt` for encrypted buckets.

- Make sure that the AWS role has the correct Microsoft account ID. In the AWS IAM area, select the **Role > Trust relationships** tab and then follow the steps in [Create a new AWS role for Microsoft Purview](#create-a-new-aws-role-for-microsoft-purview) again to verify your details.

For more information, see [Can't find the specified bucket](#cant-find-the-specified-bucket), 

### Can't find the specified bucket

Make sure that the S3 bucket URL is properly defined:

1. In AWS, navigate to your S3 bucket, and copy the bucket name.
1. In Microsoft Purview, edit the Amazon S3 data source, and update the bucket URL to include your copied bucket name, using the following syntax: `s3://<BucketName>`


## Next steps

Learn more about Microsoft Purview Insight reports:

> [!div class="nextstepaction"]
> [Understand Data Estate Insights in Microsoft Purview](concept-insights.md)
