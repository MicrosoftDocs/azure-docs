---
title: How to submit and manage jobs on an Apache Spark™ cluster in Azure HDInsight on AKS
description: Learn how to submit and manage jobs on an Apache Spark™ cluster in HDInsight on AKS
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 10/27/2023
---

# Submit and manage jobs on an Apache Spark™ cluster in HDInsight on AKS

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Once the cluster is created, user can use various interfaces to submit and manage jobs by

* using Jupyter
* using Zeppelin
* using ssh (spark-submit)

## Using Jupyter

### Prerequisites
An Apache Spark™ cluster on HDInsight on AKS. For more information, see [Create an Apache Spark cluster](./create-spark-cluster.md).

Jupyter Notebook is an interactive notebook environment that supports various programming languages.

### Create a Jupyter Notebook

1. Navigate to the Apache Spark™ cluster page and open the **Overview** tab. Click on Jupyter, it asks you to authenticate and open the Jupyter web page.

    :::image type="content" source="./media/submit-manage-jobs/select-jupyter-notebook.png" alt-text="Screenshot of how to select Jupyter notebook." border="true" lightbox="./media/submit-manage-jobs/select-jupyter-notebook.png":::

1. From the Jupyter web page, Select New > PySpark to create a notebook.
   
    :::image type="content" source="./media/submit-manage-jobs/select-pyspark.png" alt-text="Screenshot of new PySpark page." border="true" lightbox="./media/submit-manage-jobs/select-pyspark.png":::
    
    A new notebook created and opened with the name `Untitled(Untitled.ipynb)`.

    > [!NOTE]
    > By using the PySpark or the Python 3 kernel to create a notebook, the spark session is automatically created for you when you run the first code cell. You do not need to explicitly create the session. 

1. Paste the following code in an empty cell of the Jupyter Notebook, and then press SHIFT + ENTER to run the code. See [here](https://docs.jupyter.org/en/latest/) for more controls on Jupyter. 
    
    :::image type="content" source="./media/submit-manage-jobs/pyspark-page.png" alt-text="Screenshot of PySpark page with contents." lightbox="./media/submit-manage-jobs/pyspark-page.png":::

    ```
    %matplotlib inline
    import pandas as pd
    import matplotlib.pyplot as plt
    data1 = [22,40,10,50,70]
    s1 = pd.Series(data1)   #One-dimensional ndarray with axis labels (including time series).
      
    data2 = data1
    index = ['John','sam','anna','smith','ben']
    s2 = pd.Series(data2,index=index)
      
    data3 = {'John':22, 'sam':40, 'anna':10,'smith':50,'ben':70}
    s3 = pd.Series(data3)
     
    s3['jp'] = 32     #insert a new row
    s3['John'] = 88
     
    names = ['John','sam','anna','smith','ben']
    ages = [10,40,50,48,70]
    name_series = pd.Series(names)
    age_series = pd.Series(ages)
     
    data_dict = {'name':name_series, 'age':age_series}
    dframe = pd.DataFrame(data_dict)   
    #create a pandas DataFrame from dictionary
     
    dframe['age_plus_five'] = dframe['age'] + 5   
    #create a new column
    dframe.pop('age_plus_five')
    #dframe.pop('age')
     
    salary = [1000,6000,4000,8000,10000]
    salary_series = pd.Series(salary)
    new_data_dict = {'name':name_series, 'age':age_series,'salary':salary_series}
    new_dframe = pd.DataFrame(new_data_dict)
    new_dframe['average_salary'] = new_dframe['age']*90
     
    new_dframe.index = new_dframe['name']
    print(new_dframe.loc['sam'])
    ```
 
1. Plot a graph with Salary and age as the X and Y axes
1. In the same notebook, paste the following code in an empty cell of the Jupyter Notebook, and then press **SHIFT + ENTER** to run the code.

    ```
    %matplotlib inline
    import pandas as pd
    import matplotlib.pyplot as plt
     
    plt.plot(age_series,salary_series)
    plt.show()
    ```
 
    :::image type="content" source="./media/submit-manage-jobs/graph-output.png" alt-text="Screenshot of graph output." lightbox="./media/submit-manage-jobs/graph-output.png":::

### Save the Notebook
 
1. From the notebook menu bar, navigate to File > Save and Checkpoint.
1. Shut down the notebook to release the cluster resources: from the notebook menu bar, navigate to File > Close and Halt. You can also run any of the notebooks under the examples folder.

    :::image type="content" source="./media/submit-manage-jobs/save-note-books.png" alt-text="Screenshot of how to save the note books." lightbox="./media/submit-manage-jobs/save-note-books.png":::

## Using Apache Zeppelin notebooks

Apache Spark clusters in HDInsight on AKS include [Apache Zeppelin notebooks](https://zeppelin.apache.org/). Use the notebooks to run Apache Spark jobs. In this article, you learn how to use the Zeppelin notebook on an HDInsight on AKS cluster.
### Prerequisites
An Apache Spark cluster on HDInsight on AKS. For instructions, see [Create an Apache Spark cluster](./create-spark-cluster.md).

#### Launch an Apache Zeppelin notebook

1.	Navigate to the Apache Spark cluster Overview page and select Zeppelin notebook from Cluster dashboards. It prompts to authenticate and open the Zeppelin page.

    :::image type="content" source="./media/submit-manage-jobs/select-zeppelin.png" alt-text="Screenshot of how to select Zeppelin." lightbox="./media/submit-manage-jobs/select-zeppelin.png":::

1. Create a new notebook. From the header pane, navigate to Notebook > Create new note. Ensure the notebook header shows a connected status. It denotes a green dot in the top-right corner.

    :::image type="content" source="./media/submit-manage-jobs/create-zeppelin-notebook.png" alt-text="Screenshot of how to create zeppelin notebook." lightbox="./media/submit-manage-jobs/create-zeppelin-notebook.png":::

1. Run the following code in Zeppelin Notebook:

    ```
    %livy.pyspark
    import pandas as pd
    import matplotlib.pyplot as plt
    data1 = [22,40,10,50,70]
    s1 = pd.Series(data1)   #One-dimensional ndarray with axis labels (including time series).
      
    data2 = data1
    index = ['John','sam','anna','smith','ben']
    s2 = pd.Series(data2,index=index)
      
    data3 = {'John':22, 'sam':40, 'anna':10,'smith':50,'ben':70}
    s3 = pd.Series(data3)
     
    s3['jp'] = 32     #insert a new row
      
    s3['John'] = 88
      
    names = ['John','sam','anna','smith','ben']
    ages = [10,40,50,48,70]
    name_series = pd.Series(names)
    age_series = pd.Series(ages)
     
    data_dict = {'name':name_series, 'age':age_series}
    dframe = pd.DataFrame(data_dict)   #create a pandas DataFrame from dictionary
      
    dframe['age_plus_five'] = dframe['age'] + 5   #create a new column
    dframe.pop('age_plus_five')
    #dframe.pop('age')
     
    salary = [1000,6000,4000,8000,10000]
    salary_series = pd.Series(salary)
    new_data_dict = {'name':name_series, 'age':age_series,'salary':salary_series}
    new_dframe = pd.DataFrame(new_data_dict)
    new_dframe['average_salary'] = new_dframe['age']*90
     
    new_dframe.index = new_dframe['name']
    print(new_dframe.loc['sam'])
    ```
1. Select the **Play** button for the paragraph to run the snippet. The status on the right-corner of the paragraph should progress from READY, PENDING, RUNNING to FINISHED. The output shows up at the bottom of the same paragraph. The screenshot looks like the following image:

    :::image type="content" source="./media/submit-manage-jobs/run-zeppelin-notebook.png" alt-text="Screenshot of how to run Zeppelin notebook." lightbox="./media/submit-manage-jobs/run-zeppelin-notebook.png":::

    Output:

    :::image type="content" source="./media/submit-manage-jobs/zeppelin-notebook-output.png" alt-text="Screenshot of Zeppelin notebook output." lightbox="./media/submit-manage-jobs/zeppelin-notebook-output.png":::

## Using Spark submit jobs

1. Create a file using the following command `#vim samplefile.py'
1. This command opens the vim file
1. Paste the following code into the vim file
   ```
   import pandas as pd
   import matplotlib.pyplot as plt
             
   From pyspark.sql import SparkSession
   Spark = SparkSession.builder.master('yarn').appName('SparkSampleCode').getOrCreate()
   // Initialize spark context
   data1 = [22,40,10,50,70]
   s1 = pd.Series(data1)   #One-dimensional ndarray with axis labels (including time series).
          
   data2 = data1
   index = ['John','sam','anna','smith','ben']
   s2 = pd.Series(data2,index=index)
          
   data3 = {'John':22, 'sam':40, 'anna':10,'smith':50,'ben':70}
    s3 = pd.Series(data3)
         
   s3['jp'] = 32     #insert a new row
          
   s3['John'] = 88
          
   names = ['John','sam','anna','smith','ben']
   ages = [10,40,50,48,70]
   name_series = pd.Series(names)
   age_series = pd.Series(ages)
         
   data_dict = {'name':name_series, 'age':age_series}
   dframe = pd.DataFrame(data_dict)   #create a pandas DataFrame from dictionary
          
   dframe['age_plus_five'] = dframe['age'] + 5   #create a new column
   dframe.pop('age_plus_five')
   #dframe.pop('age')
         
   salary = [1000,6000,4000,8000,10000]
   salary_series = pd.Series(salary)
   new_data_dict = {'name':name_series, 'age':age_series,'salary':salary_series}
   new_dframe = pd.DataFrame(new_data_dict)
   new_dframe['average_salary'] = new_dframe['age']*90
         
   new_dframe.index = new_dframe['name']
   print(new_dframe.loc['sam'])
   ```
    
1. Save the file with the following method.
    1. Press Escape button
    1. Enter the command `:wq`
    
1. Run the following command to run the job.

    `/spark-submit  --master yarn --deploy-mode cluster <filepath>/samplefile.py`

    :::image type="content" source="./media/submit-manage-jobs/run-spark-submit-job.png" alt-text="Screenshot showing how to run Spark submit job." lightbox="./media/submit-manage-jobs/view-vim-file.png":::

## Monitor queries on an Apache Spark cluster in HDInsight on AKS

#### Spark History UI

1. Click on the Spark History Server UI from the overview Tab.

    :::image type="content" source="./media/submit-manage-jobs/select-spark-ui.png" alt-text="Screenshot showing Spark UI." lightbox="./media/submit-manage-jobs/select-spark-ui.png":::

1. Select the recent run from the UI using the same application ID.
   
    :::image type="content" source="./media/submit-manage-jobs/run-spark-ui.png" alt-text="Screenshot showing how to run Spark UI." lightbox="./media/submit-manage-jobs/run-spark-ui.png":::
   
1. View the Directed Acyclic Graph cycles and the stages of the job in the Spark History server UI.

    :::image type="content" source="./media/submit-manage-jobs/view-dag-cycle.png" alt-text="Screenshot of DAG cycle." lightbox="./media/submit-manage-jobs/view-dag-cycle.png":::

**Livy session UI**

1.	To open the Livy session UI, type the following command into your browser
    `https://<CLUSTERNAME>.<CLUSTERPOOLNAME>.<REGION>.projecthilo.net/p/livy/ui  `

    :::image type="content" source="./media/submit-manage-jobs/open-livy-session-ui.png" alt-text="Screenshot of how to open Livy session UI." lightbox="./media/submit-manage-jobs/open-livy-session-ui.png":::

1. View the driver logs by clicking on the driver option under logs.

**Yarn UI**

1. From the Overview Tab click on Yarn and, open the Yarn UI.

   :::image type="content" source="./media/submit-manage-jobs/select-yarn-ui.png" alt-text="Screenshot of how to select Yarn UI." lightbox="./media/submit-manage-jobs/select-yarn-ui.png":::
   
1. You can track the job you recently ran by the same application ID.
     
1. Click on the Application ID in Yarn to view detailed logs of the job.

   :::image type="content" source="./media/submit-manage-jobs/view-logs.png" alt-text="View Logs." lightbox="./media/submit-manage-jobs/view-logs.png":::

## Reference

* Apache, Apache Spark, Spark, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).
