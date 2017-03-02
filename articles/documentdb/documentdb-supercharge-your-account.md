---
redirect_url: https://docs.microsoft.com/azure/documentdb/documentdb-performance-levels
ROBOTS: NOINDEX, NOFOLLOW

---
# Migrate your DocumentDB S1, S2, or S3 account
Follow these steps to take advantage of increased throughput for your Azure DocumentDB account by moving to the Standard pricing tier. With little to no additional cost, you can increase the throughput of your existing S1 account from 250 [RU/s](documentdb-request-units.md) to 400 RU/s, or more! All Standard accounts benefit from the ability to scale throughput to meet the needs of your applications. You no longer need to choose from predefined throughput options, you can scale whenever you need to achieve the throughput your application requires. 

## Change to user-defined performance in the Azure portal
1. In your browser, navigate to the [**Azure portal**](https://portal.azure.com). 
2. On the left menu, click **NoSQL (DocumentDB)**, or click **More Services**, scroll to **Databases**, and then select **NoSQL (DocumentDB)**.   
3. In the **NoSQL (DocumentDB)** blade, select the account to modify.
4. In the new blade, in the menu under **Collections**, click **Scale**. 

      ![Screen shot of the DocumentDB Settings and Choose your pricing tier blades](./media/documentdb-supercharge-your-account/documentdb-change-performance.png)
5. As shown in the screenshot above, do the following: 

 - In the new blade, use the drop-down menu to select the collection with the S1, S2, or S3 pricing tier. 
 - Click **Pricing Tier S1**, **S2**, or **S3**.
 - In the **Choose your pricing tier** blade, click **Standard**, and then click **Select** to save your change.
   
6. Back in the **Scale** blade, the **Throughput (RU/s)** box is displayed with a default value of 400 and the  the **Pricing Tier** is changed to **Standard**.  You can change the throughput to whatever value your application requires. We recommend using the [DocumentDB capacity planner](https://www.documentdb.com/capacityplanner) to determine how many [Request units](documentdb-request-units.md)/second (RU/s) your application needs. The **Estimated monthly bill** area at the bottom of the page updates automatically to provide an estimate of the monthly cost. Click **Save** to save your changes. 
      
    ![Screen shot of the Settings blade showing where to change the throughput value](./media/documentdb-supercharge-your-account/documentdb-change-performance-set-thoughput.png)
7. The collection is scaled to meet the new requirements, and a success message is displayed.  
   
    ![Screen shot of the Database blade with modified collection](./media/documentdb-supercharge-your-account/documentdb-change-performance-confirmation.png)

For more information about the changes related to user-defined and pre-defined throughput, see the blog post [DocumentDB: Everything you need to know about using the new pricing options](https://azure.microsoft.com/blog/documentdb-use-the-new-pricing-options-on-your-existing-collections/).

## Next steps

Learn more about how to partition data and achieve global scale with DocumentDB in [Partitioning and scaling in Azure DocumentDB](documentdb-partition-data.md).
