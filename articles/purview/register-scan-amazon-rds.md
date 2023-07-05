---
title: Amazon RDS Multicloud scanning connector for Microsoft Purview
description: This how-to guide describes details of how to scan Amazon RDS databases, including both Microsoft SQL and PostgreSQL data.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 12/07/2022
ms.custom: references_regions, ignite-fall-2021
# Customer intent: As a security officer, I need to understand how to use the Microsoft Purview connector for Amazon RDS service to set up, configure, and scan my Amazon RDS databases.
---

# Amazon RDS Multicloud Scanning Connector for Microsoft Purview (Public preview)

The Multicloud Scanning Connector for Microsoft Purview allows you to explore your organizational data across cloud providers, including Amazon Web Services, in addition to Azure storage services.

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article describes how to use Microsoft Purview to scan your structured data currently stored in Amazon RDS, including both Microsoft SQL and PostgreSQL databases, and discover what types of sensitive information exists in your data. You'll also learn how to identify the Amazon RDS databases where the data is currently stored for easy information protection and data compliance.

For this service, use Microsoft Purview to provide a Microsoft account with secure access to AWS, where the Multicloud Scanning Connectors for Microsoft Purview will run. The Multicloud Scanning Connectors for Microsoft Purview use this access to your Amazon RDS databases to read your data, and then reports the scanning results, including only the metadata and classification, back to Azure. Use the Microsoft Purview classification and labeling reports to analyze and review your data scan results.

> [!IMPORTANT]
> The Multicloud Scanning Connectors for Microsoft Purview are separate add-ons to Microsoft Purview. The terms and conditions for the Multicloud Scanning Connectors for Microsoft Purview are contained in the agreement under which you obtained Microsoft Azure Services. For more information, see Microsoft Azure Legal Information at https://azure.microsoft.com/support/legal/.
>

## Microsoft Purview scope for Amazon RDS

- **Supported database engines**: Amazon RDS structured data storage supports multiple database engines. Microsoft Purview supports Amazon RDS with/based on Microsoft SQL and PostgreSQL.

- **Maximum columns supported**: Scanning RDS tables with more than 300 columns isn't supported.

- **Public access support**: Microsoft Purview supports scanning only with VPC Private Link in AWS, and doesn't include public access scanning.

- **Supported regions**: Microsoft Purview only supports Amazon RDS databases that are located in the following AWS regions:

    - US East (Ohio)
    - US East (N. Virginia)
    - US West (N. California)
    - US West (Oregon)
    - Europe (Frankfurt)
    - Asia Pacific (Tokyo)
    - Asia Pacific (Singapore)
    - Asia Pacific (Sydney)
    - Europe (Ireland)
    - Europe (London)
    - Europe (Paris)

- **IP address requirements**: Your RDS database must have a static IP address. The static IP address is used to configure AWS PrivateLink, as described in this article.

- **Known issues**: The following functionality isn't currently supported:

    - The **Test connection** button. The scan status messages will indicate any errors related to connection setup.
    - Selecting specific tables in your database to scan.
    - [Data lineage](concept-data-lineage.md).

For more information, see:

- [Manage and increase quotas for resources with Microsoft Purview](how-to-manage-quotas.md)
- [Supported data sources and file types in Microsoft Purview](sources-and-scans.md)
- [Use private endpoints for your Microsoft Purview account](catalog-private-link.md)

## Prerequisites

Ensure that you've performed the following prerequisites before adding your Amazon RDS database as Microsoft Purview data sources and scanning your RDS data.

> [!div class="checklist"]
> * You need to be a Microsoft Purview Data Source Admin.
> * You need a Microsoft Purview account. [Create a Microsoft Purview account instance](create-catalog-portal.md), if you don't yet have one.
> * You need an Amazon RDS PostgreSQL or Microsoft SQL database, with data.


## Configure AWS to allow Microsoft Purview to connect to your RDS VPC

Microsoft Purview supports scanning only when your database is hosted in a virtual private cloud (VPC), where your RDS database can only be accessed from within the same VPC.

The Azure Multicloud Scanning Connectors for Microsoft Purview service run in a separate, Microsoft account in AWS. To scan your RDS databases, the Microsoft AWS account needs to be able to access your RDS databases in your VPC. To allow this access, you’ll need to configure [AWS PrivateLink](https://aws.amazon.com/privatelink/) between the RDS VPC (in the customer account) to the VPC where the Multicloud Scanning Connectors for Microsoft Purview run (in the Microsoft account).

The following diagram shows the components in both your customer account and Microsoft account. Highlighted in yellow are the components you’ll need to create to enable connectivity RDS VPC in your account to the VPC where the Multicloud Scanning Connectors for Microsoft Purview run in the Microsoft account.

:::image type="content" source="media/register-scan-amazon-rds/vpc-architecture.png" alt-text="Diagram of the Multicloud Scanning Connectors for Microsoft Purview service in a VPC architecture." border="false":::


> [!IMPORTANT]
> Any AWS resources created for a customer's private network will incur extra costs on the customer's AWS bill.
>

### Configure AWS PrivateLink using a CloudFormation template

The following procedure describes how to use an AWS CloudFormation template to configure AWS PrivateLink, allowing Microsoft Purview to connect to your RDS VPC. This procedure is performed in AWS and is intended for an AWS admin.

This CloudFormation template is available for download from the [Azure GitHub repository](https://github.com/Azure/Azure-Purview-Starter-Kit/tree/main/Amazon/AWS/RDS), and will help you create a target group, load balancer, and endpoint service.

- **If you have multiple RDS servers in the same VPC**, perform this procedure once, [specifying all RDS server IP addresses and ports](#parameters). In this case, the CloudFormation output will include different ports for each RDS server.

    When [registering these RDS servers as data sources in Microsoft Purview](#register-an-amazon-rds-data-source), use the ports included in the output instead of the real RDS server ports.

- **If you have RDS servers in multiple VPCs**, perform this procedure for each of the VPCs.


> [!TIP]
> You can also perform this procedure manually. For more information, see [Configure AWS PrivateLink manually (advanced)](#configure-aws-privatelink-manually-advanced).
>

**To prepare your RDS database with a CloudFormation template**:

1. Download the CloudFormation [RDSPrivateLink_CloudFormation.yaml](https://github.com/Azure/Azure-Purview-Starter-Kit/tree/main/Amazon/AWS/RDS) template required for this procedure from the Azure GitHub repository:

    1. At the right of the [linked GitHub page](https://github.com/Azure/Azure-Purview-Starter-Kit/blob/main/Amazon/AWS/RDS/Amazon_AWS_RDS_PrivateLink_CloudFormation.zip), select **Download** to download the zip file.

    1. Extract the .zip file to a local location so that you can access the **RDSPrivateLink_CloudFormation.yaml** file.

1. In the AWS portal, navigate to the **CloudFormation** service. At the top-right of the page, select **Create stack** > **With new resources (standard)**.

1. On the **Prerequisite - Prepare Template** page, select **Template is ready**.

1. In the **Specify template** section, select **Upload a template file**. Select **Choose file**, navigate to the **RDSPrivateLink_CloudFormation.yaml** file you downloaded earlier, and then select **Next** to continue.

1. In the **Stack name** section, enter a name for your stack. This name will be used, together with an automatically added suffix, for the resource names created later in the process. Therefore:

    - Make sure to use a meaningful name for your stack.
    - Make sure that the stack name is no longer than 19 characters.

1. <a name="parameters"></a>In the **Parameters** area, enter the following values, using data available from your RDS database page in AWS:

    |Name  |Description  |
    |---------|---------|
    |**Endpoint & port**    | Enter the resolved IP address of the RDS endpoint URL and port. For example: `192.168.1.1:5432` <br><br>- **If an RDS proxy is configured**, use the IP address of the read/write endpoint of the proxy for the relevant database. We recommend using an RDS proxy when working with Microsoft Purview, as the IP address is static.<br><br>- **If you have multiple endpoints behind the same VPC**, enter up to 10, comma-separated endpoints.  In this case, a single load balancer is created to the VPC, allowing a connection from the Amazon RDS Multicloud Scanning Connector for Microsoft Purview in AWS to all RDS endpoints in the VPC.       |
    |**Networking**     | Enter your VPC ID        |
    |**VPC IPv4 CIDR**     | Enter the value your VPC's CIDR. You can find this value by selecting the VPC link on your RDS database page. For example: `192.168.0.0/16`        |
    |**Subnets**     |Select all the subnets that are associated with your VPC.         |
    |**Security**     | Select the VPC security group associated with the RDS database.         |
    |     |         |

    When you're done, select **Next** to continue.

1. The settings on the **Configure stack options** are optional for this procedure.

    Define your settings as needed for your environment. For more information, select the **Learn more** links to access the AWS documentation. When you're done, select **Next** to continue.

1. On the **Review** page, check to make sure that the values you selected are correct for your environment. Make any changes needed and then select **Create stack** when you're done.

1. Watch for the resources to be created. When complete, relevant data for this procedure is shown on the following tabs:

    - **Events**: Shows the events / activities performed by the CloudFormation template
    - **Resources**: Shows the newly created target group, load balancer, and endpoint service
    - **Outputs**: Displays the **ServiceName** value, and the IP address and port of the RDS servers

        If you have multiple RDS servers configured, a different port is displayed. In this case, use the port shown here instead of the actual RDS server port when [registering your RDS database](#register-an-amazon-rds-data-source) as Microsoft Purview data source.

1. In the **Outputs** tab, copy the **ServiceName** key value to the clipboard.

    You'll use the value of the **ServiceName** key in the Microsoft Purview governance portal, when [registering your RDS database](#register-an-amazon-rds-data-source) as Microsoft Purview data source. There, enter the **ServiceName** key in the **Connect to private network via endpoint service** field.

## Register an Amazon RDS data source

**To add your Amazon RDS server as a Microsoft Purview data source**:

1. In Microsoft Purview, navigate to the **Data Map** page, and select **Register** ![Register icon.](./media/register-scan-amazon-s3/register-button.png).

1.	On the **Sources** page, select **Register.** On the **Register sources** page that appears on the right, select the **Database** tab, and then select **Amazon RDS (PostgreSQL)** or **Amazon RDS (SQL)**.

    :::image type="content" source="media/register-scan-amazon-rds/register-amazon-rds.png" alt-text="Screenshot of the Register sources page to select Amazon RDS (PostgreSQL)." lightbox="media/register-scan-amazon-rds/register-amazon-rds.png":::

1. Enter the details for your source:

    |Field  |Description  |
    |---------|---------|
    |**Name**     |  Enter a meaningful name for your source, such as `AmazonPostgreSql-Ups`       |
    |**Server name**     | Enter the name of your RDS database in the following syntax: `<instance identifier>.<xxxxxxxxxxxx>.<region>.rds.amazonaws.com`  <br><br>We recommend that you copy this URL from the Amazon RDS portal, and make sure that the URL includes the AWS region.      |
    |**Port**     |  Enter the port used to connect to the RDS database:<br><br>        - PostgreSQL: `5432`<br> - Microsoft SQL: `1433`<br><br>        If you've [configured AWS PrivateLink using a CloudFormation template](#configure-aws-privatelink-using-a-cloudformation-template) and have multiple RDS servers in the same VPC, use the ports listed in the CloudFormation **Outputs**  tab instead of the read RDS server ports.       |
    |**Connect to private network via endpoint service**     |  Enter the **ServiceName** key value obtained at the end of the [previous procedure](#configure-aws-privatelink-using-a-cloudformation-template). <br><br>If you've prepared your RDS database manually, use the **Service Name** value obtained at the end of [Step 5: Create an endpoint service](#step-5-create-an-endpoint-service).       |
    |**Collection** (optional)     |  Select a collection to add your data source to. For more information, see [Manage data sources in Microsoft Purview (Preview)](manage-data-sources.md).       |
    |     |         |

1. Select **Register** when you’re ready to continue.

Your RDS data source appears in the Sources map or list. For example:

:::image type="content" source="media/register-scan-amazon-rds/amazon-rds-in-sources.png" alt-text="Screenshot of an Amazon RDS data source on the Sources page.":::

## Create Microsoft Purview credentials for your RDS scan

Credentials supported for Amazon RDS data sources include username/password authentication only, with a password stored in an Azure KeyVault secret.

### Create a secret for your RDS credentials to use in Microsoft Purview

1.	Add your password to an Azure KeyVault as a secret. For more information, see [Set and retrieve a secret from Key Vault using Azure portal](../key-vault/secrets/quick-create-portal.md).

1.	Add an access policy to your KeyVault with **Get** and **List** permissions. For example:

    :::image type="content" source="media/register-scan-amazon-rds/keyvault-for-rds.png" alt-text="Screenshot of an access policy for RDS in Microsoft Purview.":::

    When defining the principal for the policy, select your Microsoft Purview account. For example:

    :::image type="content" source="media/register-scan-amazon-rds/select-purview-as-principal.png" alt-text="Screenshot of selecting your Microsoft Purview account as Principal.":::

    Select **Save** to save your Access Policy update. For more information, see [Assign an Azure Key Vault access policy](/azure/key-vault/general/assign-access-policy-portal).

1. In Microsoft Purview, add a KeyVault connection to connect the KeyVault with your RDS secret to Microsoft Purview. For more information, see [Credentials for source authentication in Microsoft Purview](manage-credentials.md).

### Create your Microsoft Purview credential object for RDS

In Microsoft Purview, create a credentials object to use when scanning your Amazon RDS account.

1. In the Microsoft Purview **Management** area, select **Security and access** > **Credentials** > **New**.

1. Select **SQL authentication** as the authentication method. Then, enter details for the Key Vault where your RDS credentials are stored, including the names of your Key Vault and secret.

    For example:

    :::image type="content" source="media/register-scan-amazon-rds/new-credential-for-rds.png" alt-text="Screenshot of a new credential for RDS.":::

For more information, see [Credentials for source authentication in Microsoft Purview](manage-credentials.md).

## Scan an Amazon RDS database

To configure a Microsoft Purview scan for your RDS database:

1.	From the Microsoft Purview **Sources** page, select the Amazon RDS data source to scan.

1.	Select :::image type="icon" source="media/register-scan-amazon-s3/new-scan-button.png" border="false"::: **New scan** to start defining your scan. In the pane that opens on the right, enter the following details, and then select **Continue**.

    - **Name**: Enter a meaningful name for your scan.
    - **Database name**: Enter the name of the database you want to scan. You’ll need to find the names available from outside Microsoft Purview, and create a separate scan for each database in the registered RDS server.
    - **Credential**: Select the credential you created earlier for the Multicloud Scanning Connectors for Microsoft Purview to access the RDS database.

1.	On the **Select a scan rule set** pane, select the scan rule set you want to use, or create a new one. For more information, see [Create a scan rule set](create-a-scan-rule-set.md).

1.	On the **Set a scan trigger** pane, select whether you want to run the scan once, or at a recurring time, and then select **Continue**.

1.	On the **Review your scan** pane, review the details and then select **Save and Run**, or **Save** to run it later.

While you run your scan, select **Refresh** to monitor the scan progress.

> [!NOTE]
> When working with Amazon RDS PostgreSQL databases, only full scans are supported. Incremental scans are not supported as PostgreSQL does not have a **Last Modified Time** value. 
>

## Explore scanning results

After a Microsoft Purview scan is complete on your Amazon RDS databases, drill down in the Microsoft Purview **Data Map**  area to view the scan history. Select a data source to view its details, and then select the **Scans** tab to view any currently running or completed scans.

Use the other areas of Microsoft Purview to find out details about the content in your data estate, including your Amazon RDS databases:

- **Explore RDS data in the catalog**. The Microsoft Purview catalog shows a unified view across all source types, and RDS scanning results are displayed in a similar way to Azure SQL. You can browse the catalog using filters or browse the assets and navigate through the hierarchy. For more information, see:

    - [Tutorial: Browse assets in Microsoft Purview (preview) and view their lineage](tutorial-browse-and-view-lineage.md)
    - [Search the Microsoft Purview Data Catalog](how-to-search-catalog.md)
    - [Register and scan an Azure SQL Database](register-scan-azure-sql-database.md)

- **View Insight reports** to view statistics for the classification, sensitivity labels, file types, and more details about your content.

    All Microsoft Purview Insight reports include the Amazon RDS scanning results, along with the rest of the results from your Azure data sources. When relevant, an **Amazon RDS** asset type is added to the report filtering options.

    For more information, see the [Understand Data Estate Insights in Microsoft Purview](concept-insights.md).

- **View RDS data in other Microsoft Purview features**, such as the **Scans** and **Glossary** areas. For more information, see:

    - [Create a scan rule set](create-a-scan-rule-set.md)
    - [Tutorial: Create and import glossary terms in Microsoft Purview (preview)](tutorial-import-create-glossary-terms.md)


## Configure AWS PrivateLink manually (advanced)

This procedure describes the manual steps required for preparing your RDS database in a VPC to connect to Microsoft Purview.

By default, we recommend that you use a CloudFormation template instead, as described earlier in this article. For more information, see [Configure AWS PrivateLink using a CloudFormation template](#configure-aws-privatelink-using-a-cloudformation-template).

### Step 1: Retrieve your Amazon RDS endpoint IP address

Locate the IP address of your Amazon RDS endpoint, hosted inside an Amazon VPC. You’ll use this IP address later in the process when you create your target group.

**To retrieve your RDS endpoint IP address**:

1.	In Amazon RDS, navigate to your RDS database, and identify your endpoint URL. This is located under **Connectivity & security**, as your **Endpoint** value.

    > [!TIP]
    > Use the following command to get a list of the databases in your endpoint: `aws rds describe-db-instances`
    >

1.	Use the endpoint URL to find the IP address of your Amazon RDS database. For example, use one of the following methods:

    - **Ping**: `ping <DB-Endpoint>`

    - **nslookup**: `nslookup <Db-Endpoint>`

    - **Online nslookup**. Enter your database **Endpoint** value in the search box and select **Find DNS records**. **NSLookup.io** shows your IP address on the next screen.

### Step 2: Enable your RDS connection from a load balancer

To ensure that your RDS connection will be allowed from the load balancer you create later in the process:

1.	**Find the VPC IP range**.

    In Amazon RDS, navigate to your RDS database. In the **Connectivity & security** area, select the **VPC** link to find its IP range (IPv4 CIDR).

    In the **Your VPCs** area, your IP range is shown in the **IPv4 CIDR** column.

    > [!TIP]
    > To perform this step via CLI, use the following command: `aws ec2 describe-vpcs`
    >
    > For more information, see [ec2 — AWS CLI 1.19.105 Command Reference (amazon.com)](https://docs.aws.amazon.com/cli/latest/reference/ec2/).
    >

1.	<a name="security-group"></a>**Create a Security Group for this IP range**.

    1. Open the Amazon EC2 console at https://console.aws.amazon.com/ec2/ and navigate to **Security Groups**.

    1. Select **Create security group** and then create your security group, making sure to include the following details:

        - **Security group name**: Enter a meaningful name
        - **Description**: Enter a description for your security group
        - **VPC**: Select your RDS database VPC

    1.	Under **Inbound rules**, select **Add rule** and enter the following details:

        - **Type**: Select **Custom TCP**
        - **Port range**: Enter your RDS database port
        - **Source**: Select **Custom** and enter the VPC IP range from the previous step.

    1.	Scroll to the bottom of the page and select **Create security group**.

1.	**Associate the new security group to RDS**.

    1.	In Amazon RDS, navigate to your RDS database, and select **Modify**.

    1.	Scroll down to the **Connectivity** section, and in the **Security group** field, add the new security group that you created in the [previous step](#security-group). Then scroll down to the bottom of the page and select **Continue.**

    1.	In the **Scheduling of modifications** section, select **Apply immediately** to update the security group immediately.

    1.	Select **Modify DB instance**.

> [!TIP]
> To perform this step via CLI, use the following commands:
>
> - `aws  ec2 create-security-group--description <value>--group-name <value>[--vpc-id <value>]`
>
>     For more information, see [create-security-group — AWS CLI 1.19.105 Command Reference (amazon.com)](https://docs.aws.amazon.com/cli/latest/reference/ec2/create-security-group.html).
>
> - `aws rds --db-instance-identifier <value> --vpc-security-group-ids <value>`
>
>     For more information, see [modify-db-instance — AWS CLI 1.19.105 Command Reference (amazon.com)](https://docs.aws.amazon.com/cli/latest/reference/rds/modify-db-instance.html).
>

### Step 3: Create a target group

**To create your target group in AWS**:

1.	Open the Amazon EC2 console at https://console.aws.amazon.com/ec2/ and navigate to **Load Balancing** > **Target Groups**.

1.	Select **Create target group**, and create your target group, making sure to include the following details:

    - **Target type**: Select **IP addresses** (optional)
    - **Protocol**: Select **TCP**
    - **Port**: Enter your RDS database port
    - **VPC**: Enter your RDS database VPC

    > [!NOTE]
    > You can find the RDS database port and VPC values on your RDS database page, under **Connectivity & security**

    When you’re done, select **Next** to continue.

1.	In the **Register targets** page, enter your RDS database IP address, and then select **Include as pending below**.

1.	After you see the new target listed in the **Targets** table, select **Create target group** at the bottom of the page.

> [!TIP]
> To perform this step via CLI, use the following command:
>
> - `aws elbv2 create-target-group --name <tg-name> --protocol <db-protocol> --port <db-port> --target-type ip --vpc-id <db-vpc-id>`
>
>     For more information, see [create-target-group — AWS CLI 2.2.7 Command Reference (amazonaws.com)](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/elbv2/create-target-group.html).
>
> - `aws elbv2 register-targets --target-group-arn <tg-arn> --targets Id=<db-ip>,Port=<db-port>`
>
>     For more information, see [register-targets — AWS CLI 2.2.7 Command Reference (amazonaws.com)](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/elbv2/register-targets.html).
>

### Step 4: Create a load balancer

You can either [create a new network load balancer](#create-load-balancer) to forward traffic to the RDS IP address, or [add a new listener](#listener) to an existing load balancer.

<a name="create-load-balancer"></a>**To create a network load balancer to forward traffic to the RDS IP address**:

1.	Open the Amazon EC2 console at https://console.aws.amazon.com/ec2/ and navigate to **Load Balancing** > **Load Balancers**.

1.	Select **Create Load Balancer** > **Network Load Balancer** and then select or enter the following values:

    - **Scheme**: Select **Internal**

    - **VPC**: Select your RDS database VPC

    - **Mapping**: Make sure that the RDS is defined for all AWS regions, and then make sure to select all of those regions. You can find this information in the **Availability zone** value on the [RDS database](#step-1-retrieve-your-amazon-rds-endpoint-ip-address) page, on the **Connectivity & security** tab.

    - **Listeners and Routing**:

        - *Protocol*: Select **TCP**
        - *Port*: Select **RDS DB port**
        - *Default action*: Select the target group created in the [previous step](#step-3-create-a-target-group)

1.	At the bottom of the page, select **Create Load Balancer** > **View Load Balancers**.

1.	Wait few minutes and refresh the screen, until the **State** column of the new Load Balancer is **Active.**


> [!TIP]
> To perform this step via CLI, use the following commands:
> - `aws elbv2 create-load-balancer --name <lb-name> --type network --scheme internal --subnet-mappings SubnetId=<value>`
>
>    For more information, see [create-load-balancer — AWS CLI 2.2.7 Command Reference (amazonaws.com)](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/elbv2/create-load-balancer.html).
>
> - `aws elbv2 create-listener --load-balancer-arn <lb-arn> --protocol TCP --port 80 --default-actions Type=forward,TargetGroupArn=<tg-arn>`
>
>    For more information, see [create-listener — AWS CLI 2.2.7 Command Reference (amazonaws.com)](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/elbv2/create-listener.html).
>

<a name="listener"></a>**To add a listener to an existing load balancer**:

1. Open the Amazon EC2 console at https://console.aws.amazon.com/ec2/ and navigate to **Load Balancing** > **Load Balancers**.

1. Select your load balancer > **Listeners** > **Add listener**.

1. On the **Listeners** tab, in the **Protocol : port** area, select **TCP** and enter a new port for your listener.


> [!TIP]
> To perform this step via CLI, use the following command: `aws elbv2  create-listener --load-balancer-arn <value> --protocol <value>  --port <value> --default-actions Type=forward,TargetGroupArn=<target_group_arn>`
>
> For more information, see the [AWS documentation](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-listener.html).
>

### Step 5: Create an endpoint service

After the [Load Balancer is created](#step-4-create-a-load-balancer) and its State is **Active** you can create the endpoint service.

**To create the endpoint service**:

1.	Open the Amazon VPC console at https://console.aws.amazon.com/vpc/ and navigate to **Virtual Private Cloud > Endpoint Services**.

1.	Select **Create Endpoint Service**, and in the **Available Load Balancers** dropdown list, select the new load balancer created in the [previous step](#step-4-create-a-load-balancer), or the load balancer where you'd added a new listener.

1.	In the **Create endpoint service** page, clear the selection for the **Require acceptance for endpoint** option.

1.	At the bottom of the page, select **Create Service** > **Close**.

1.	Back in the **Endpoint services** page:

    1. Select the new endpoint service you created.
    1. In the **Allow principals** tab, select **Add principals**.
    1. In the **Principals to add > ARN** field, enter `arn:aws:iam::181328463391:root`.
    1. Select **Add principals**.

    > [!NOTE]
    > When adding an identity, use an asterisk (*****) to add permissions for all principals. This enables all principals, in all AWS accounts to create an endpoint to your endpoint service. For more information, see the [AWS documentation](https://docs.aws.amazon.com/vpc/latest/privatelink/add-endpoint-service-permissions.html).

> [!TIP]
> To perform this step via CLI, use the following commands:
>
> - `aws ec2 create-vpc-endpoint-service-configuration --network-load-balancer-arns  <lb-arn>  --no-acceptance-required`
>
>    For more information, see [create-vpc-endpoint-service-configuration — AWS CLI 2.2.7 Command Reference (amazonaws.com)](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ec2/create-vpc-endpoint-service-configuration.html).
>
> - `aws ec2 modify-vpc-endpoint-service-permissions --service-id <endpoint-service-id> --add-allowed-principals <purview-scanner-arn>`
>
>    For more information, see [modify-vpc-endpoint-service-permissions — AWS CLI 2.2.7 Command Reference (amazonaws.com)](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ec2/modify-vpc-endpoint-service-permissions.html).
>

<a name="service-name"></a>**To copy the service name for use in Microsoft Purview**:

After you’ve created your endpoint service, you can copy the **Service name** value in the Microsoft Purview governance portal, when [registering your RDS database](#register-an-amazon-rds-data-source) as Microsoft Purview data source.

Locate the **Service name** on the **Details** tab for your selected endpoint service.

> [!TIP]
> To perform this step via CLI, use the following command: `Aws ec2 describe-vpc-endpoint-services`
>
> For more information, see [describe-vpc-endpoint-services — AWS CLI 2.2.7 Command Reference (amazonaws.com)](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ec2/describe-vpc-endpoint-services.html).
>

## Troubleshoot your VPC connection

This section describes common errors that may occur when configuring your VPC connection with Microsoft Purview, and how to troubleshoot and resolve them.

### Invalid VPC service name

If an error of `Invalid VPC service name` or `Invalid endpoint service` appears in Microsoft Purview, use the following steps to troubleshoot:

1. Make sure that your VPC service name is correct. For example:

    :::image type="content" source="media/register-scan-amazon-rds/locate-service-name.png" alt-text="Screenshot of the VPC service name in AWS." lightbox="media/register-scan-amazon-rds/locate-service-name.png":::

1. Make sure that the Microsoft ARN is listed in the allowed principals: `arn:aws:iam::181328463391:root`

    For more information, see [Step 5: Create an endpoint service](#step-5-create-an-endpoint-service).

1. Make sure that your RDS database is listed in one of the supported regions. For more information, see [Microsoft Purview scope for Amazon RDS](#microsoft-purview-scope-for-amazon-rds).

### Invalid availability zone

If an error of `Invalid Availability Zone` appears in Microsoft Purview, make sure that your RDS is defined for at least one of the following three regions:

- **us-east-1a**
- **us-east-1b**
- **us-east-1c**

For more information, see the [AWS documentation](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-getting-started.html).

### RDS errors

The following errors may appear in Microsoft Purview:

- `Unknown database`. In this case, the database defined doesn't exist. Check to see that the configured database name is correct

- `Failed to login to the Sql data source. The given auth credential does not have permission on the target database.` In this case, your username and password is incorrect. Check your credentials and update them as needed.


## Next steps

Learn more about Microsoft Purview Insight reports:

> [!div class="nextstepaction"]
> [Understand Data Estate Insights in Microsoft Purview](concept-insights.md)
