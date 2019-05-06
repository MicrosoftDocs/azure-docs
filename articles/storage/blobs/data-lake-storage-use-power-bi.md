---
title: Analyze data in Azure Data Lake Storage Gen2 by using Power BI | Microsoft Docs
description: Use Power BI to analyze data stored in Azure Data Lake Storage Gen2
services: storage
author: normesta
ms.service: storage
ms.topic: article
ms.date: 05/02/2019
ms.author: normesta
---

# Analyze data in Azure Data Lake Storage Gen2 by using Power BI

In this article you'll learn how to use Power BI Desktop to analyze and visualize data that is stored in a storage account that has a hierarchical namespace (Azure Data Lake Storage Gen2).

## Prerequisites

Before you begin this tutorial, you must have the following:

> [!div class="checklist"]
> * An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
> * A storage account that has a hierarchical namespace. Follow [these](data-lake-storage-quickstart-create-account.md) instructions to create one.
> This article assumes that you've created an account named `myadlsg2`.
> * A sample data file named `Drivers.txt` located in your storage account.
> You can download this sample from [Azure Data Lake Git Repository](https://github.com/Azure/usql/tree/master/Examples/Samples/Data/AmbulanceDataDrivers.txt), and then upload that file to your storage account.

## Install the preview version of Power BI Desktop

This version contains the Azure Data Lake Storage Gen2 (Beta) Connector. This version is supported only on x64 architectures of the Windows operating system.

1. Click [here](https://contosoblobstoragev2.blob.core.windows.net/adlsg2connector/PBIDesktop_x64.msi) to download the MSI installer for the preview version of Power BI Desktop.
2. Run the MSI installer and follow the instructions in the setup wizard.

   > [!NOTE]
   > If you experience issues with the installer, extract the **SkipVerification.zip** file from [this](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2F1drv.ms%2Fu%2Fs!AmfmHLh2qqs6w7QdBu-EehW5CEfJhw&data=02%7C01%7Cbensack%40microsoft.com%7C5d0308b717dd48bdc82608d6c74a5cd9%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636915519528922797&sdata=WvnHLfO9nNnvVDXxFWN4I0Ji7UBv6oIovyBwQxFibqw%3D&reserved=0) location onto your local computer. Then, run the **SkipVerficiation.bat** file. After the script completes, try running the MSI installer again.

## Create a report in Power BI Desktop

1. Launch Power BI Desktop on your computer.
2. From the **Home** tab of the Ribbon, click **Get Data**, and then click **More**.
3. In the **Get Data** dialog box, click **Azure**, click **Azure Data Lake Store Gen2 (Beta)**, and then click **Connect**.

    ![Get data page](media/data-lake-storage-use-power-bi/get-data-page.png)

4. If you see a dialog box about the connector being in a development phase, opt to continue.

5. In the **Azure Data Lake Storage Gen2** dialog box, provide the URL to your primary Azure Data Lake Storage Gen2 file system endpoint, and then click **OK**.

    ![URL](media/data-lake-storage-use-power-bi/adls-url.png)

6. In the next dialog box, click **Sign in** to sign into your storage account. You'll be redirected to your organization's sign in page. Follow the prompts to sign into the account.

    ![Sign in page](media/data-lake-storage-use-power-bi/sign-in.png)

7. After you've successfully signed in, click **Connect**.

    ![Signed in page](media/data-lake-storage-use-power-bi/signed-in.png)

8. The next dialog box shows the available file systems, and the file that you uploaded to your storage account. Verify the information, and then click **Load**.

    ![File systems](media/data-lake-storage-use-power-bi/file-systems.png)

9. After the data has been successfully loaded into Power BI, you'll see the following fields in the **Fields** tab.

    ![Fields tab](media/data-lake-storage-use-power-bi/fields.png)

    However, to visualize and analyze the data, we prefer the data to be available per the following fields.

    ![Fields](media/data-lake-storage-use-power-bi/preferred-fields.png)

    In the next steps, we will update the query to convert the imported data in the desired format.

10. From the **Home** tab on the ribbon, click **Edit Queries**.

    ![Queries](media/data-lake-storage-use-power-bi/queries.png)

11. In the **Query Editor**, under the **Content** column, click **Binary**. The file will automatically be detected as CSV and you should see an output as shown below. Your data is now available in a format that you can use to create visualizations.

    ![Output](media/data-lake-storage-use-power-bi/binary.png)

12. From the **Home** tab on the ribbon, click **Close** and **Apply**, and then click **Close** and **Apply**.

    ![Close and apply](media/data-lake-storage-use-power-bi/close-apply.png)

13. Once the query is updated, the **Fields** tab will show the new fields available for visualization.

    ![New fields](media/data-lake-storage-use-power-bi/new-fields.png)

14. Let us create a pie chart to represent the drivers in each city for a given country. To do so, make the following selections.

    From the **Visualizations** tab, click the symbol for a pie chart.

    ![Visualizations](media/data-lake-storage-use-power-bi/visualizations.png)

    The columns that we are going to use are Column 4 (name of the city) and Column 7 (name of the country). Drag these columns from **Fields** tab to **Visualizations** tab as shown below.

    ![Drag fields](media/data-lake-storage-use-power-bi/visualizations-drag-fields.png)

    The pie chart should now resemble like the one shown below.

    ![Pie chart](media/data-lake-storage-use-power-bi/pie-chart.png)

15. By selecting a specific country from the page level filters, you can now see the number of drivers in each city of the selected country. For example, under the **Visualizations** tab, under **Page level filters**, select **Brazil**.

    ![Page filters](media/data-lake-storage-use-power-bi/page-filters.png)

16. The pie chart is automatically updated to display the drivers in the cities of Brazil.

    ![Brazil](media/data-lake-storage-use-power-bi/pie-chart-updated.png)

17. From the **File** menu, click **Save** to save the visualization as a Power BI Desktop file.

## Publish report to Power BI service

After you've created the visualizations in Power BI Desktop, you can share it with others by publishing it to the Power BI service. For instructions on how to do that, see [Publish from Power BI Desktop](https://powerbi.microsoft.com/documentation/powerbi-desktop-upload-desktop-files/).