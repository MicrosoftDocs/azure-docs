<properties
	pageTitle="Compute-intensive Java application on a VM | Microsoft Azure"
	description="Learn how to create an Azure virtual machine that runs a compute-intensive Java application that can be monitored by another Java application."
	services="virtual-machines-windows"
	documentationCenter="java"
	authors="rmcmurray"
	manager="wpickett"
	editor=""
	tags="azure-service-management,azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="Java"
	ms.topic="article"
	ms.date="06/24/2016"
	ms.author="robmcm"/>

# How to run a compute-intensive task in Java on a virtual machine

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]
 

With Azure, you can use a virtual machine to handle compute-intensive tasks. For example, a virtual machine can handle tasks and deliver results to client machines or mobile applications. After reading this article, you will have an understanding of how to create a virtual machine that runs a compute-intensive Java application that can be monitored by another Java application.

This tutorial assumes you know how to create Java console applications, can import libraries to your Java application, and can generate a Java archive (JAR). No knowledge of Microsoft Azure is assumed.

You will learn:

* How to create a virtual machine with a Java Development Kit (JDK) already installed.
* How to remotely log in to your virtual machine.
* How to create a service bus namespace.
* How to create a Java application that performs a compute-intensive task.
* How to create a Java application that monitors the progress of the compute-intensive task.
* How to run the Java applications.
* How to stop the Java applications.

This tutorial will use the Traveling Salesman Problem for the compute-intensive task. The following is an example of the Java application running the compute-intensive task.

![Traveling Salesman Problem solver][solver_output]

The following is an example of the Java application monitoring the compute-intensive task.

![Traveling Salesman Problem client][client_output]

[AZURE.INCLUDE [create-account-and-vms-note](../../includes/create-account-and-vms-note.md)]

## To create a virtual machine

1. Log in to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **New**, click **Compute**, click **Virtual machine**, and then click **From Gallery**.
3. In the **Virtual machine image select** dialog box, select **JDK 7 Windows Server 2012**.
Note that **JDK 6 Windows Server 2012** is available in case you have legacy applications that are not yet ready to run in JDK 7.
4. Click **Next**.
4. In the **Virtual machine configuration** dialog box:
    1. Specify a name for the virtual machine.
    2. Specify the size to use for the virtual machine.
    3. Enter a name for the administrator in the **User Name** field. Remember this name and the password you will enter next, you will use them when you remotely log in to the virtual machine.
    4. Enter a password in the **New password** field, and re-enter it in the **Confirm** field. This is the Administrator account password.
    5. Click **Next**.
5. In the next **Virtual machine configuration** dialog box:
    1. For **Cloud service**, use the default **Create a new cloud service**.
    2. The value for **Cloud service DNS name** must be unique across cloudapp.net. If needed, modify this value so that Azure indicates it is unique.
    2. Specify a region, affinity group, or virtual network. For purposes of this tutorial, specify a region such as **West US**.
    2. For **Storage Account**, select **Use an automatically generated storage account**.
    3. For **Availability Set**, select **(None)**.
    4. Click **Next**.
5. In the final **Virtual machine configuration** dialog box:
    1. Accept the default endpoint entries.
    2. Click **Complete**.

## To remotely log in to your virtual machine

1. Log on to the [Azure classic portal](https://manage.windowsazure.com).
2. Click **Virtual machines**.
3. Click the name of the virtual machine that you want to log in to.
4. Click **Connect**.
5. Respond to the prompts as needed to connect to the virtual machine. When prompted for the administrator name and password, use the values that you provided when you created the virtual machine.

Note that the Azure Service Bus functionality requires the Baltimore CyberTrust Root certificate to be installed as part of your JRE's **cacerts** store. This certificate is automatically included in the Java Runtime Environment (JRE) used by this tutorial. If you do not have this certificate in your JRE **cacerts** store, see [Adding a Certificate to the Java CA Certificate Store][add_ca_cert] for information on adding it (as well as information on viewing the certificates in your cacerts store).

## How to create a service bus namespace

To begin using Service Bus queues in Azure, you must first
create a service namespace. A service namespace provides a scoping
container for addressing Service Bus resources within your application.

To create a service namespace:

1.  Log on to the [Azure classic portal](https://manage.windowsazure.com).
2.  In the lower-left navigation pane of the Azure classic portal, click **Service Bus, Access Control & Caching**.
3.  In the upper-left pane of the Azure classic portal, click the **Service
    Bus** node, and then click the **New** button.  
    ![Service Bus Node screenshot][svc_bus_node]
4.  In the **Create a new Service Namespace** dialog box, enter a
    **Namespace**, and then to make sure that it is unique, click the
    **Check Availability** button.  
    ![Create a New Namespace screenshot][create_namespace]
5.  After making sure the namespace name is available, choose the
    country or region in which your namespace should be hosted, and then click the **Create Namespace** button.  

    The namespace you created will then appear in the Azure classic portal
    and takes a moment to activate. Wait until the status is **Active** before continuing with the next step.

## Obtain the Default Management Credentials for the namespace

In order to perform management operations, such as creating a queue, on
the new namespace, you need to obtain the management credentials for the
namespace.

1.  In the left navigation pane, click the **Service Bus** node to
    display the list of available namespaces.
    ![Available Namespaces screenshot][avail_namespaces]
2.  Select the namespace you just created from the list shown.
    ![Namespace List screenshot][namespace_list]
3.  The right-hand **Properties** pane lists the properties for the
    new namespace.
    ![Properties Pane screenshot][properties_pane]
4.  The **Default Key** is hidden. Click the **View** button to display
    the security credentials.
    ![Default Key screenshot][default_key]
5.  Make a note of the **Default Issuer** and the **Default Key** as you
    will use this information below to perform operations with the
    namespace.

## How to create a Java application that performs a compute-intensive task

1. On your development machine (which does not have to be the virtual machine that you created), download the [Azure SDK for Java](https://azure.microsoft.com/develop/java/).
2. Create a Java console application using the example code at the end of this section. In this tutorial, we'll use **TSPSolver.java** as the Java file name. Modify the **your\_service\_bus\_namespace**, **your\_service\_bus\_owner**, and **your\_service\_bus\_key** placeholders to use your service bus **namespace**, **Default Issuer** and **Default Key** values, respectively.
3. After coding, export the application to a runnable Java archive (JAR), and package the required libraries into the generated JAR. In this tutorial, we'll use **TSPSolver.jar** as the generated JAR name.

<p/>

	// TSPSolver.java

	import com.microsoft.windowsazure.services.core.Configuration;
	import com.microsoft.windowsazure.services.core.ServiceException;
	import com.microsoft.windowsazure.services.serviceBus.*;
	import com.microsoft.windowsazure.services.serviceBus.models.*;
	import java.io.*;
	import java.text.DateFormat;
	import java.text.SimpleDateFormat;
	import java.util.ArrayList;
	import java.util.Date;
	import java.util.List;

	public class TSPSolver {

	    //  Value specifying how often to provide an update to the console.
	    private static long loopCheck = 100000000;  

	    private static long nTimes = 0, nLoops=0;

	    private static double[][] distances;
	    private static String[] cityNames;
	    private static int[] bestOrder;
	    private static double minDistance;
	    private static ServiceBusContract service;

	    private static void buildDistances(String fileLocation, int numCities) throws Exception{
	        try{
	            BufferedReader file = new BufferedReader(new InputStreamReader(new DataInputStream(new FileInputStream(new File(fileLocation)))));
	            double[][] cityLocs = new double[numCities][2];
	            for (int i = 0; i<numCities; i++){
	                String[] line = file.readLine().split(", ");
	                cityNames[i] = line[0];
	                cityLocs[i][0] = Double.parseDouble(line[1]);
	                cityLocs[i][1] = Double.parseDouble(line[2]);
	            }
	            for (int i = 0; i<numCities; i++){
	                for (int j = i; j<numCities; j++){
	                    distances[i][j] = Math.hypot(Math.abs(cityLocs[i][0] - cityLocs[j][0]), Math.abs(cityLocs[i][1] - cityLocs[j][1]));
	                    distances[j][i] = distances[i][j];
	                }
	            }
	        } catch (Exception e){
	            throw e;
	        }
	    }

	    private static void permutation(List<Integer> startCities, double distSoFar, List<Integer> restCities) throws Exception {

	        try
	        {
	            nTimes++;
	            if (nTimes == loopCheck)
	            {
	                nLoops++;
	                nTimes = 0;
	                DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
	                Date date = new Date();
	                System.out.print("Current time is " + dateFormat.format(date) + ". ");
	                System.out.println(  "Completed " + nLoops + " iterations of size of " + loopCheck + ".");
	            }

	            if ((restCities.size() == 1) && ((minDistance == -1) || (distSoFar + distances[restCities.get(0)][startCities.get(0)] + distances[restCities.get(0)][startCities.get(startCities.size()-1)] < minDistance))){
	                startCities.add(restCities.get(0));
	                newBestDistance(startCities, distSoFar + distances[restCities.get(0)][startCities.get(0)] + distances[restCities.get(0)][startCities.get(startCities.size()-2)]);
	                startCities.remove(startCities.size()-1);
	            }
	            else{
	                for (int i=0; i<restCities.size(); i++){
	                    startCities.add(restCities.get(0));
	                    restCities.remove(0);
	                    permutation(startCities, distSoFar + distances[startCities.get(startCities.size()-1)][startCities.get(startCities.size()-2)],restCities);
	                    restCities.add(startCities.get(startCities.size()-1));
	                    startCities.remove(startCities.size()-1);
	                }
	            }
	        }
	        catch (Exception e)
	        {
	            throw e;
	        }
	    }

	    private static void newBestDistance(List<Integer> cities, double distance) throws ServiceException, Exception {
	        try
	        {
		        minDistance = distance;
		        String cityList = "Shortest distance is "+minDistance+", with route: ";
		        for (int i = 0; i<bestOrder.length; i++){
		            bestOrder[i] = cities.get(i);
		            cityList += cityNames[bestOrder[i]];
		            if (i != bestOrder.length -1)
		                cityList += ", ";
		        }
		        System.out.println(cityList);
	            service.sendQueueMessage("TSPQueue", new BrokeredMessage(cityList));
	        }
	        catch (ServiceException se)
	        {
	            throw se;
	        }
	        catch (Exception e)
	        {
	            throw e;
	        }
	    }

	    public static void main(String args[]){

	        try {

	            Configuration config = ServiceBusConfiguration.configureWithWrapAuthentication(
	                    "your_service_bus_namespace", "your_service_bus_owner",
                        "your_service_bus_key",
                        ".servicebus.windows.net",
                        "-sb.accesscontrol.windows.net/WRAPv0.9");

	            service = ServiceBusService.create(config);

	            int numCities = 10;  // Use as the default, if no value is specified at command line.
	            if (args.length != 0)
	            {
	                if (args[0].toLowerCase().compareTo("createqueue")==0)
	                {
	                    // No processing to occur other than creating the queue.
	                    QueueInfo queueInfo = new QueueInfo("TSPQueue");

	                    service.createQueue(queueInfo);

	                    System.out.println("Queue named TSPQueue was created.");

	                    System.exit(0);
	                }

	                if (args[0].toLowerCase().compareTo("deletequeue")==0)
	                {
	                    // No processing to occur other than deleting the queue.
	                    service.deleteQueue("TSPQueue");

	                    System.out.println("Queue named TSPQueue was deleted.");

	                    System.exit(0);
	                }

	                // Neither creating or deleting a queue.
	                // Assume the value passed in is the number of cities to solve.
	                numCities = Integer.valueOf(args[0]);  
	            }

	            System.out.println("Running for " + numCities + " cities.");

	            List<Integer> startCities = new ArrayList<Integer>();
	            List<Integer> restCities = new ArrayList<Integer>();
	            startCities.add(0);
	            for(int i = 1; i<numCities; i++)
	                restCities.add(i);
	            distances = new double[numCities][numCities];
	            cityNames = new String[numCities];
	            buildDistances("c:\\TSP\\cities.txt", numCities);
	            minDistance = -1;
	            bestOrder = new int[numCities];
	            permutation(startCities, 0, restCities);
	            System.out.println("Final solution found!");
	            service.sendQueueMessage("TSPQueue", new BrokeredMessage("Complete"));
	        }
	        catch (ServiceException se)
	        {
	            System.out.println(se.getMessage());
	            se.printStackTrace();
	            System.exit(-1);
	        }
	        catch (Exception e)
	        {
	            System.out.println(e.getMessage());
	            e.printStackTrace();
	            System.exit(-1);
	        }
	    }

	}



## How to create a Java application that monitors the progress of the compute-intensive task

1. On your development machine, create a Java console application using the example code at the end of this section. In this tutorial, we'll use **TSPClient.java** as the Java file name. As shown earlier, modify the **your\_service\_bus\_namespace**, **your\_service\_bus\_owner**, and **your\_service\_bus\_key** placeholders to use your service bus **namespace**, **Default Issuer** and **Default Key** values, respectively.
2. Export the application to a runnable JAR, and package the required libraries into the generated JAR. In this tutorial, we'll use **TSPClient.jar** as the generated JAR name.

<p/>

	// TSPClient.java

	import java.util.Date;
	import java.text.DateFormat;
	import java.text.SimpleDateFormat;
	import com.microsoft.windowsazure.services.serviceBus.*;
	import com.microsoft.windowsazure.services.serviceBus.models.*;
	import com.microsoft.windowsazure.services.core.*;

	public class TSPClient
	{

	    public static void main(String[] args)
	    {
	            try
	            {

	                DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
	                Date date = new Date();
	                System.out.println("Starting at " + dateFormat.format(date) + ".");

	                String namespace = "your_service_bus_namespace";
	                String issuer = "your_service_bus_owner";
	                String key = "your_service_bus_key";

	                Configuration config;
	                config = ServiceBusConfiguration.configureWithWrapAuthentication(
	                        namespace, issuer, key,
                            ".servicebus.windows.net",
                            "-sb.accesscontrol.windows.net/WRAPv0.9");

	                ServiceBusContract service = ServiceBusService.create(config);

	                BrokeredMessage message;

	                int waitMinutes = 3;  // Use as the default, if no value is specified at command line.
	                if (args.length != 0)
	                {
	                    waitMinutes = Integer.valueOf(args[0]);  
	                }

	                String waitString;

	                waitString = (waitMinutes == 1) ? "minute." : waitMinutes + " minutes.";

	                // This queue must have previously been created.
	                service.getQueue("TSPQueue");

	                int numRead;

	                String s = null;

	                while (true)
	                {

	                    ReceiveQueueMessageResult resultQM = service.receiveQueueMessage("TSPQueue");
	                    message = resultQM.getValue();

	                    if (null != message && null != message.getMessageId())
	                    {

	                        // Display the queue message.
	                        byte[] b = new byte[200];

	                        System.out.print("From queue: ");

	                        s = null;
	                        numRead = message.getBody().read(b);
	                        while (-1 != numRead)
	                        {
	                            s = new String(b);
	                            s = s.trim();
	                            System.out.print(s);
	                            numRead = message.getBody().read(b);
	                        }
	                        System.out.println();
	                        if (s.compareTo("Complete") == 0)
	                        {
	                            // No more processing to occur.
	                            date = new Date();
	                            System.out.println("Finished at " + dateFormat.format(date) + ".");
	                            break;
	                        }
	                    }
	                    else
	                    {
	                        // The queue is empty.
	                        System.out.println("Queue is empty. Sleeping for another " + waitString);
	                        Thread.sleep(60000 * waitMinutes);
	                    }
	                }

	        }
	        catch (ServiceException se)
	        {
	            System.out.println(se.getMessage());
	            se.printStackTrace();
	            System.exit(-1);
	        }
	        catch (Exception e)
	        {
	            System.out.println(e.getMessage());
	            e.printStackTrace();
	            System.exit(-1);
	        }

	    }

	}

## How to run the Java applications
Run the compute-intensive application, first to create the queue, then to solve the Traveling Saleseman Problem, which will add the current best route to the service bus queue. While the compute-intensive application is running (or afterwards), run the client to display results from the service bus queue.

### To run the compute-intensive application

1. Log on to your virtual machine.
2. Create a folder where you will run your application. For example, **c:\TSP**.
3. Copy **TSPSolver.jar** to **c:\TSP**,
4. Create a file named **c:\TSP\cities.txt** with the following contents.

		City_1, 1002.81, -1841.35
		City_2, -953.55, -229.6
		City_3, -1363.11, -1027.72
		City_4, -1884.47, -1616.16
		City_5, 1603.08, -1030.03
		City_6, -1555.58, 218.58
		City_7, 578.8, -12.87
		City_8, 1350.76, 77.79
		City_9, 293.36, -1820.01
		City_10, 1883.14, 1637.28
		City_11, -1271.41, -1670.5
		City_12, 1475.99, 225.35
		City_13, 1250.78, 379.98
		City_14, 1305.77, 569.75
		City_15, 230.77, 231.58
		City_16, -822.63, -544.68
		City_17, -817.54, -81.92
		City_18, 303.99, -1823.43
		City_19, 239.95, 1007.91
		City_20, -1302.92, 150.39
		City_21, -116.11, 1933.01
		City_22, 382.64, 835.09
		City_23, -580.28, 1040.04
		City_24, 205.55, -264.23
		City_25, -238.81, -576.48
		City_26, -1722.9, -909.65
		City_27, 445.22, 1427.28
		City_28, 513.17, 1828.72
		City_29, 1750.68, -1668.1
		City_30, 1705.09, -309.35
		City_31, -167.34, 1003.76
		City_32, -1162.85, -1674.33
		City_33, 1490.32, 821.04
		City_34, 1208.32, 1523.3
		City_35, 18.04, 1857.11
		City_36, 1852.46, 1647.75
		City_37, -167.44, -336.39
		City_38, 115.4, 0.2
		City_39, -66.96, 917.73
		City_40, 915.96, 474.1
		City_41, 140.03, 725.22
		City_42, -1582.68, 1608.88
		City_43, -567.51, 1253.83
		City_44, 1956.36, 830.92
		City_45, -233.38, 909.93
		City_46, -1750.45, 1940.76
		City_47, 405.81, 421.84
		City_48, 363.68, 768.21
		City_49, -120.3, -463.13
		City_50, 588.51, 679.33

5. At a command prompt, change directories to c:\TSP.
6. Ensure the JRE's bin folder is in the PATH environment variable.
7. You'll need to create the service bus queue before you run the TSP solver permutations. Run the following command to create the service bus queue.

        java -jar TSPSolver.jar createqueue

8. Now that the queue is created, you can run the TSP solver permutations. For example, run the following command to run the solver for 8 cities.

        java -jar TSPSolver.jar 8

 If you don't specify a number, it will run for 10 cities. As the solver finds current shortest routes, it will add them to the queue.

> [AZURE.NOTE]
> The larger the number that you specify, the longer the solver will run. For example, running for 14 cities could take several minutes, and running for 15 cities could take several hours. Increasing to 16 or more cities could result in days of runtime (eventually weeks, months, and years). This is due to the rapid increase in the number of permutations evaluated by the solver as the number of cities increases.

### How to run the monitoring client application
1. Log on to your machine where you will run the client application. This does not need to be the same machine running the **TSPSolver** application, although it can be.
2. Create a folder where you will run your application. For example, **c:\TSP**.
3. Copy **TSPClient.jar** to **c:\TSP**,
4. Ensure the JRE's bin folder is in the PATH environment variable.
5. At a command prompt, change directories to c:\TSP.
6. Run the following command.

        java -jar TSPClient.jar

    Optionally, specify the number of minutes to sleep in between checking the queue, by passing in a command-line argument. The default sleep period for checking the queue is 3 minutes, which is used if no command-line argument is passed to **TSPClient**. If you want to use a different value for the sleep interval, for example, one minute, run the following command.

	    java -jar TSPClient.jar 1

    The client will run until it sees a queue message of "Complete". Note that if you run multiple occurrences of the solver without running the client, you may need to run the client multiple times to completely empty the queue. Alternatively, you can delete the queue and then create it again. To delete the queue, run the following **TSPSolver** (not **TSPClient**)  command.

        java -jar TSPSolver.jar deletequeue

    The solver will run until it finishes examining all routes.

## How to stop the Java applications
For both the solver and client applications, you can press **Ctrl+C** to exit if you want to end prior to normal completion.


[solver_output]: ./media/virtual-machines-windows-classic-java-run-compute-intensive-task/WA_JavaTSPSolver.png
[client_output]: ./media/virtual-machines-windows-classic-java-run-compute-intensive-task/WA_JavaTSPClient.png
[svc_bus_node]: ./media/virtual-machines-windows-classic-java-run-compute-intensive-task/SvcBusQueues_02_SvcBusNode.jpg
[create_namespace]: ./media/virtual-machines-windows-classic-java-run-compute-intensive-task/SvcBusQueues_03_CreateNewSvcNamespace.jpg
[avail_namespaces]: ./media/virtual-machines-windows-classic-java-run-compute-intensive-task/SvcBusQueues_04_SvcBusNode_AvailNamespaces.jpg
[namespace_list]: ./media/virtual-machines-windows-classic-java-run-compute-intensive-task/SvcBusQueues_05_NamespaceList.jpg
[properties_pane]: ./media/virtual-machines-windows-classic-java-run-compute-intensive-task/SvcBusQueues_06_PropertiesPane.jpg
[default_key]: ./media/virtual-machines-windows-classic-java-run-compute-intensive-task/SvcBusQueues_07_DefaultKey.jpg
[add_ca_cert]: ../java-add-certificate-ca-store.md
