---
 title: include file
 description: include file
 services: cosmos-db
ms.custom: include file, ignite-2022
---

1. In a new browser window, sign in to the [Azure portal](https://portal.azure.com/).

2. In the left menu, select **Create a resource**.
   
   :::image type="content" source="./media/cosmos-db-create-dbaccount-mongodb/create-nosql-db-databases-json-tutorial-0.png" alt-text="Screenshot of creating a resource in the Azure portal.":::
   
3. On the **New** page, select **Databases** > **Azure Cosmos DB**.
   
   :::image type="content" source="./media/cosmos-db-create-dbaccount-mongodb/create-nosql-db-databases-json-tutorial-1.png" alt-text="Screenshot of the Azure portal Databases pane.":::
   
4. On the **Select API option** page, select **Azure Cosmos DB for MongoDB** > **Create**.

   The API determines the type of account to create. Select **Azure Cosmos DB for MongoDB**  because you will create a collection that works with MongoDB in this quickstart. To learn more, see [Overview of Azure Cosmos DB for MongoDB](../mongodb/introduction.md).

   :::image type="content" source="./media/cosmos-db-create-dbaccount-mongodb/azure-cosmos-db-select-api.png" alt-text="Screenshot of the Select API option pane.":::

5. On the **Create Azure Cosmos DB Account** page, enter the settings for the new Azure Cosmos DB account.

   |Setting|Value|Description |
   |---|---|---|
   |Subscription|Subscription name|Select the Azure subscription that you want to use for this Azure Cosmos DB account. |
   |Resource Group|Resource group name|Select a resource group, or select **Create new**, then enter a unique name for the new resource group. |
   |Account Name|Enter a unique name|Enter a unique name to identify your Azure Cosmos DB account. Your account URI will be *mongo.cosmos.azure.com* appended to your unique account name.<br><br>The account name can use only lowercase letters, numbers, and hyphens (-), and must be between 3 and 44 characters long.|
   |Location|The region closest to your users|Select a geographic location to host your Azure Cosmos DB account. Use the location that is closest to your users to give them the fastest access to the data.|
   |Capacity mode|Provisioned throughput or Serverless|Select **Provisioned throughput** to create an account in [provisioned throughput](../set-throughput.md) mode. Select **Serverless** to create an account in [serverless](../serverless.md) mode.<br><br>**Note**: Only API for MongoDB versions 4.2, 4.0, and 3.6 are supported by serverless accounts. Choosing 3.2 as the version will force the account in provisioned throughput mode.|
   |Apply Azure Cosmos DB free tier discount|**Apply** or **Do not apply**|With Azure Cosmos DB free tier, you will get the first 1000 RU/s and 25 GB of storage for free in an account. Learn more about [free tier](https://azure.microsoft.com/pricing/details/cosmos-db/).|
   | Version | Choose the required server version | Azure Cosmos DB for MongoDB is compatible with the server version 4.2, 4.0, 3.6, and 3.2. You can [upgrade or downgrade](../mongodb/upgrade-mongodb-version.md) an account after it is created. |

   > [!NOTE]
   > You can have up to one free tier Azure Cosmos DB account per Azure subscription and must opt-in when creating the account. If you do not see the option to apply the free tier discount, this means another account in the subscription has already been enabled with free tier.

   :::image type="content" source="./media/cosmos-db-create-dbaccount-mongodb/azure-cosmos-db-create-new-account.png" alt-text="Screenshot of the new account page for Azure Cosmos DB."::: 

1. In the **Global Distribution** tab, configure the following details. You can leave the default values for the purpose of this quickstart:

   |Setting|Value|Description |
   |---|---|---|
   |Geo-Redundancy|Disable|Enable or disable global distribution on your account by pairing your region with a pair region. You can add more regions to your account later.|
   |Multi-region Writes|Disable|Multi-region writes capability allows you to take advantage of the provisioned throughput for your databases and containers across the globe.|

   > [!NOTE]
   > The following options are not available if you select **Serverless** as the **Capacity mode**:
   > - Apply Free Tier Discount
   > - Geo-redundancy
   > - Multi-region Writes

1. Optionally you can configure additional details in the following tabs:

   * **Networking** - Configure [access from a virtual network](../how-to-configure-vnet-service-endpoint.md).
   * **Backup Policy** - Configure either [periodic](../periodic-backup-restore-introduction.md) or [continuous](../provision-account-continuous-backup.md) backup policy.
   * **Encryption** - Use either service-managed key or a [customer-managed key](../how-to-setup-cmk.md#create-a-new-azure-cosmos-account).
   * **Tags** - Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

1. Select **Review + create**.

4. The account creation takes a few minutes. Wait for the portal to display the **Congratulations! Your Azure Cosmos DB for MongoDB account is ready** page.

   :::image type="content" source="./media/cosmos-db-create-dbaccount-mongodb/azure-cosmos-db-account-created.png" alt-text="Screenshot of the Azure portal Notifications pane."::: 
