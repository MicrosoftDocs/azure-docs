<properties
	pageTitle="How to run a compute-intensive task in .NET on an Azure virtual machine"
	description="Learn how to deploy and run a compute-intensive .NET app on an Azure virtual machine and use Azure Service Bus queues to monitor progress remotely."
	services="virtual-machines"
	documentationCenter=".net"
	authors="wadepickett"
	manager="wpickett"
	editor="mollybos"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="06/25/2015"
	ms.author="wpickett"/>

# How to run a compute-intensive task in .NET on an Azure virtual machine

With Azure, you can use a virtual machine to handle compute-intensive tasks. For example, a virtual machine can handle tasks and deliver results to client machines or mobile applications. After completing the tutorial, you will understand how to create a virtual machine that runs a compute-intensive .NET application that can be monitored by another .NET application.

This tutorial assumes you know how to create .NET console applications. No knowledge of Azure is assumed.

You will learn:

* How to create a virtual machine.
* How to remotely log in to your virtual machine.
* How to create an Azure Service Bus namespace.
* How to create a .NET application that performs a compute-intensive task.
* How to create a .NET application that monitors the progress of the compute-intensive task.
* How to run the .NET applications.
* How to stop the .NET applications.

This tutorial will use the Traveling Salesman Problem for the compute-intensive task. The following is an example of the .NET application running the compute-intensive task.

![Traveling Salesman Problem solver][solver_output]

The following is an example of the .NET application monitoring the compute-intensive task.

![Traveling Salesman Problem client][client_output]

[AZURE.INCLUDE [create-account-and-vms-note](../../includes/create-account-and-vms-note.md)]

## To create a virtual machine

1. Log in to the [Azure portal](https://manage.windowsazure.com).
2. Click **New**.
3. Click **Virtual machine**.
4. Click **Quick create**.
5. In the **Create a virtual machine** screen, enter a value for **DNS name**.
6. From the **Image** drop-down list, select an image, such as **Windows Server 2012 R2**.
7. Enter a name for the administrator in the **User Name** field. Remember this name and the password that you will enter next, you will use them when you remotely log in to the virtual machine.
8. Enter a password in the **New password** field, and enter it again in the **Confirm** field.
9. From the **Location** drop-down list, select the data center location for your virtual machine.
10. Click **Create virtual machine**. You can monitor the status in the **Virtual machines** section of the Azure portal. When its status is displayed as **Active**, you can log in to the virtual machine.

## To remotely log in to your virtual machine

1. Log in to the [Azure portal](https://manage.windowsazure.com).
2. Click **Virtual machines**.
3. Click the name of the virtual machine that you want to log in to.
4. Click **Connect**.
5. Respond to the prompts as needed to connect to the virtual machine. When prompted for the administrator name and password, use the values that you provided when you created the virtual machine.

## How to create a Service Bus namespace

To begin using Service Bus queues in Azure, you must first
create a service namespace. A service namespace provides a scoping
container for addressing Service Bus resources within your application.

To create a service namespace:

1.  Log in to the [Azure portal](https://manage.windowsazure.com).
2.  In the left navigation pane of the Azure portal, click **Service Bus**.
3.  In the lower pane of the Azure portal, click  **Create**.

    ![Create new service bus][create_service_bus]
4.  In the **Create a namespace** dialog box, enter a namespace name. The system immediately checks to see if the name is available, as it must be a unique name.

    ![Create a namespace dialog][create_namespace_dialog]
5.  After ensuring the namespace name is available, choose the region in which your namespace should be hosted (make sure you use the same region in which your virtual machine is hosted).

    > [AZURE.IMPORTANT] Pick the **same region** that you use or intend to use for your virtual machine. This will give you the best performance.

6. If you have more than one Azure subscription for the account with which you're logged on, select the subscription to use for the namespace. (If you have only one subscription for the account with which you're logged on, you will not see a drop-down list containing your subscriptions.)
7. Click the check mark. The system now creates your service namespace and enables it. You might have to wait several minutes as the system provisions resources for your account.

	![Click create screenshot][click_create]

The namespace you created will then appear in the Azure portal, and it takes a moment to activate. Wait until the status is **Active** before continuing with the next step.

## Obtain the default management credentials for the namespace

In order to perform management operations, such as creating a queue, on
the new namespace, you need to obtain the management credentials for the
namespace.

1.  In the left navigation pane, click **Service Bus** to
    display the list of available namespaces.
    ![Available namespaces screenshot][available_namespaces]
2.  Select the namespace you just created from the list.
    ![Namespace list screenshot][namespace_list]
3. Click **Connection Information**.
    ![Access key button][access_key_button]
4.  In the dialog box, find the **Connection String** entry. Make a note of this value, as you will use this information later in the tutorial to perform operations with the namespace.

## How to create a .NET application that performs a compute-intensive task

1. On your development machine (which does not have to be the virtual machine that you created), download the [Azure SDK for .NET](http://azure.microsoft.com/develop/net/).
2. Create a .NET console application with the project named TSPSolver. Ensure the traget framework is set for .**NET Framework 4** or later (not **.NET Framework 4 Client Profile**). The target framework can be set after you create a project by the following: In Visual Studio's menu, click **Projects**, click **Properties**, click the **Application** tab, and then set the value for **Target framework**.
3. Add the Microsoft ServiceBus library. In Visual Studio Solution Explorer, right-click **TSPSolver**, click **Add Reference**, click the **Browse** tab, browse to the Azure .NET SDK (for example, C:\Program Files\Microsoft SDKs\Azure\.NET SDK\v2.5\ToolsRef) and then select **Microsoft.ServiceBus.dll** as a reference.
4. Add the System Runtime Serialization library. In Visual Studio Solution Explorer, right-click **TSPSolver**, click **Add Reference**, click the **.NET** tab, and then select **System.Runtime.Serialization** as a reference.
5. Use the example code at the end of this section for the contents of the Program.cs file.
6. Modify the **your\_connection\_string** placeholder to use your Service Bus **connection string**.
7. Compile the application. This will create TSPSolver.exe in your project's bin folder (either bin\release or bin\debug, depending on whether you're targeting a release or debug build). You'll copy this executable and Microsoft.ServiceBus.dll to your virtual machine later.

<p/>

	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Text;
	using System.IO;

	using Microsoft.ServiceBus;
	using Microsoft.ServiceBus.Messaging;

	namespace TSPSolver
	{
	    class Program
	    {
	        // Value specifying how often to provide an update to the console.
	        private static long loopCheck = 100000000;
	        private static long nTimes = 0, nLoops = 0;

	        private static double[,] distances;
	        private static String[] cityNames;
	        private static int[] bestOrder;
	        private static double minDistance;

	        private static NamespaceManager namespaceManager;
	        private static QueueClient queueClient;
	        private static String queueName = "TSPQueue";

	        private static void BuildDistances(String fileLocation, int numCities)
	        {

	            try
	            {
	                StreamReader sr = new StreamReader(fileLocation);
	                String[] sep1 = { ", " };

	                double[,] cityLocs = new double[numCities, 2];

	                for (int i = 0; i < numCities; i++)
	                {
	                    String[] line = sr.ReadLine().Split(sep1, StringSplitOptions.None);
	                    cityNames[i] = line[0];
	                    cityLocs[i, 0] = Convert.ToDouble(line[1]);
	                    cityLocs[i, 1] = Convert.ToDouble(line[2]);
	                }
	                sr.Close();

	                for (int i = 0; i < numCities; i++)
	                {
	                    for (int j = i; j < numCities; j++)
	                    {
	                        distances[i, j] = hypot(Math.Abs(cityLocs[i, 0] - cityLocs[j, 0]), Math.Abs(cityLocs[i, 1] - cityLocs[j, 1]));
	                        distances[j, i] = distances[i, j];
	                    }
	                }
	            }
	            catch (Exception e)
	            {
	                throw e;
	            }
	        }

	        private static double hypot(double x, double y)
	        {
	            return Math.Sqrt(x * x + y * y);
	        }

	        private static void permutation(List<int> startCities, double distSoFar, List<int> restCities)
	        {
	            try
	            {

	                nTimes++;
	                if (nTimes == loopCheck)
	                {
	                    nLoops++;
	                    nTimes = 0;
	                    DateTime dateTime = DateTime.Now;
	                    Console.Write("Current time is {0}.", dateTime);
	                    Console.WriteLine(" Completed {0} iterations of size of {1}.", nLoops, loopCheck);
	                }

	                if ((restCities.Count == 1) && ((minDistance == -1) || (distSoFar + distances[restCities[0], startCities[0]] + distances[restCities[0], startCities[startCities.Count - 1]] < minDistance)))
	                {
	                    startCities.Add(restCities[0]);
	                    newBestDistance(startCities, distSoFar + distances[restCities[0], startCities[0]] + distances[restCities[0], startCities[startCities.Count - 2]]);
	                    startCities.Remove(startCities[startCities.Count - 1]);
	                }
	                else
	                {
	                    for (int i = 0; i < restCities.Count; i++)
	                    {
	                        startCities.Add(restCities[0]);
	                        restCities.Remove(restCities[0]);
	                        permutation(startCities, distSoFar + distances[startCities[startCities.Count - 1], startCities[startCities.Count - 2]], restCities);
	                        restCities.Add(startCities[startCities.Count - 1]);
	                        startCities.Remove(startCities[startCities.Count - 1]);
	                    }
	                }
	            }
	            catch (Exception e)
	            {
	                throw e;
	            }
	        }

	        private static void newBestDistance(List<int> cities, double distance)
	        {
	            try
	            {
	                minDistance = distance;
	                String cityList = "Shortest distance is " + minDistance + ", with route: ";

	                for (int i = 0; i < bestOrder.Length; i++)
	                {
	                    bestOrder[i] = cities[i];
	                    cityList += cityNames[bestOrder[i]];
	                    if (i != bestOrder.Length - 1)
	                        cityList += ", ";
	                }
	                Console.WriteLine(cityList);
	                queueClient.Send(new BrokeredMessage(cityList));
	            }
	            catch (Exception e)
	            {
	                throw e;
	            }
	        }

	        static void Main(string[] args)
	        {
	            try
	            {

                  String connectionString = @"your_connection_string";

	                int numCities = 10; // Use as the default, if no value is specified
	                // at the command line.
	                if (args.Count() != 0)
	                {

	                    if (args[0].ToLower().CompareTo("createqueue") == 0)
	                    {
	                        // No processing to occur other than creating the queue.
	                        namespaceManager = NamespaceManager.CreateFromConnectionString(connectionString);
	                        namespaceManager.CreateQueue(queueName);
	                        Console.WriteLine("Queue named {0} was created.", queueName);
	                        Environment.Exit(0);
	                    }

	                    if (args[0].ToLower().CompareTo("deletequeue") == 0)
	                    {
	                        // No processing to occur other than deleting the queue.
	                        namespaceManager = NamespaceManager.CreateFromConnectionString(connectionString);
	                        namespaceManager.DeleteQueue("TSPQueue");
	                        Console.WriteLine("Queue named {0} was deleted.", queueName);
	                        Environment.Exit(0);
	                    }

	                    // Neither creating or deleting a queue.
	                    // Assume the value passed in is the number of cities to solve.
	                    numCities = Convert.ToInt32(args[0]);
	                }

	                Console.WriteLine("Running for {0} cities.", numCities);

	                queueClient = QueueClient.CreateFromConnectionString(connectionString, "TSPQueue");

	                List<int> startCities = new List<int>();
	                List<int> restCities = new List<int>();

	                startCities.Add(0);
	                for (int i = 1; i < numCities; i++)
	                {
	                    restCities.Add(i);
	                }
	                distances = new double[numCities, numCities];
	                cityNames = new String[numCities];
	                BuildDistances(@"c:\tsp\cities.txt", numCities);
	                minDistance = -1;
	                bestOrder = new int[numCities];
	                permutation(startCities, 0, restCities);
	                Console.WriteLine("Final solution found!");
	                queueClient.Send(new BrokeredMessage("Complete"));

	                queueClient.Close();
	                Environment.Exit(0);

	            }
	            catch (ServerBusyException serverBusyException)
	            {
	                Console.WriteLine("ServerBusyException encountered");
	                Console.WriteLine(serverBusyException.Message);
	                Console.WriteLine(serverBusyException.StackTrace);
	                Environment.Exit(-1);
	            }
	            catch (ServerErrorException serverErrorException)
	            {
	                Console.WriteLine("ServerErrorException encountered");
	                Console.WriteLine(serverErrorException.Message);
	                Console.WriteLine(serverErrorException.StackTrace);
	                Environment.Exit(-1);
	            }
	            catch (Exception exception)
	            {
	                Console.WriteLine("Exception encountered");
	                Console.WriteLine(exception.Message);
	                Console.WriteLine(exception.StackTrace);
	                Environment.Exit(-1);
	            }
	        }
	    }
	}



## How to create a .NET application that monitors the progress of the compute-intensive task

1. On your development machine, create a .NET console application using TSPClient as the project name. Ensure the target framework is set for .**NET Framework 4** or later (not **.NET Framework 4 Client Profile**). The target framework can be set after you create a project with the following: In Visual Studio's menu, click **Projects**, click **Properties**, click the **Application** tab, and then set the value for **Target framework**.
2. Add in the Microsoft ServiceBus library. In Visual Studio Solution Explorer, right-click **TSPClient**, click **Add Reference**, click the **Browse** tab, browse to the Azure .NET SDK (for example, C:\Program Files\Microsoft SDKs\Azure\.NET SDK\v2.5\ToolsRef) and then select **Microsoft.ServiceBus.dll** as a reference.
3. Add the System Runtime Serialization library. In Visual Studio Solution Explorer, right-click **TSPClient**, click **Add Reference**, click the **.NET** tab, and then select **System.Runtime.Serialization** as a reference.
4. Use the example code at the end of this section for the contents of the Program.cs file.
5. Modify the **your\_connection\_string** placeholder to use your Service Bus **connection string**.
6. Compile the application. This will create TSPClient.exe in your project's bin folder (either bin\release or bin\debug, depending on whether you're targeting a release or debug build). You can run this code from your development machine, or copy this executable and Microsoft.ServiceBus.dll to a machine that will run the client application (it does not need to be on your virtual machine).

<p/>

	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Text;
	using System.IO;

	using Microsoft.ServiceBus;
	using Microsoft.ServiceBus.Messaging;
	using System.Threading; // For Thread.Sleep

	namespace TSPClient
	{
	    class Program
	    {

	        static void Main(string[] args)
	        {

	            try
	            {

	                Console.WriteLine("Starting at {0}", DateTime.Now);

									String connectionString = @"your_connection_string";

	                QueueClient queueClient = QueueClient.CreateFromConnectionString(connectionString, "TSPQueue");

	                BrokeredMessage message;

	                int waitMinutes = 3;  // Use as the default, if no value
	                // is specified at command line.

	                if (0 != args.Length)
	                {
	                    waitMinutes = Convert.ToInt16(args[0]);
	                }

	                String waitString;
	                waitString = (waitMinutes == 1) ? "minute" : waitMinutes.ToString() + " minutes";

	                while (true)
	                {
	                    message = queueClient.Receive();

	                    if (message != null)
	                    {
	                        try
	                        {
	                            string str = message.GetBody<string>();
	                            Console.WriteLine(str);

	                            // Remove message from queue.
	                            message.Complete();

	                            if ("Complete" == str)
	                            {
	                                Console.WriteLine("Finished at {0}.", DateTime.Now);
	                                break;
	                            }
	                        }
	                        catch (Exception e)
	                        {
	                            // Indicates a problem. Unlock the message in the queue.
	                            message.Abandon();
	                            throw e;
	                        }
	                    }
	                    else
	                    {
	                        // The queue is empty.
	                        Console.WriteLine("Queue is empty. Sleeping for another {0}.", waitString);
	                        System.Threading.Thread.Sleep(60000 * waitMinutes);
	                    }
	                }
	                queueClient.Close();
	                Environment.Exit(0);
	            }
	            catch (ServerBusyException serverBusyException)
	            {
	                Console.WriteLine("ServerBusyException encountered");
	                Console.WriteLine(serverBusyException.Message);
	                Console.WriteLine(serverBusyException.StackTrace);
	                Environment.Exit(-1);
	            }
	            catch (ServerErrorException serverErrorException)
	            {
	                Console.WriteLine("ServerErrorException encountered");
	                Console.WriteLine(serverErrorException.Message);
	                Console.WriteLine(serverErrorException.StackTrace);
	                Environment.Exit(-1);
	            }
	            catch (Exception exception)
	            {
	                Console.WriteLine("Exception encountered");
	                Console.WriteLine(exception.Message);
	                Console.WriteLine(exception.StackTrace);
	                Environment.Exit(-1);
	            }
	        }
	    }
	}

## How to run the .NET applications

Run the compute-intensive application, first to create the queue, then to solve the Traveling Saleseman Problem, which will add the current best route to the Service Bus queue. While the compute-intensive application is running (or afterwards), run the client to display results from the Service Bus queue.

### How to run the compute-intensive application

1. Log in to your virtual machine.
2. Create a folder named c:\TSP. This is where you will run your application.
3. Copy TSPSolver.exe and Microsoft.ServiceBus.dll, both of which are available in your TSPSolver project's bin folder, to c:\TSP.
4. Create a file named c:\TSP\cities.txt with the following contents.

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
6. You'll need to create the Service Bus queue before you run the TSP solver permutations. Run the following command to create the Service Bus queue.

        TSPSolver createqueue

7. Now that the queue is created, you can run the TSP solver permutations. For example, run the following command to run the solver for 8 cities.

        TSPSolver 8

 If you don't specify a number, the solver will run for 10 cities. As the solver finds current shortest routes, it will add them to the queue.

The solver will run until it finishes examining all routes.

> [AZURE.NOTE]
> The larger the number that you specify, the longer the solver will run. For example, running for 14 cities could take several minutes, and running for 15 cities could take several hours. Increasing to 16 or more cities could result in days of run time (eventually weeks, months, and years). This is due to the rapid increase in the number of permutations evaluated by the solver as the number of cities increases.

### How to run the monitoring client application
1. Log in to your machine where you will run the client application. This does not need to be the same machine running the TSPSolver application, although it can be.
2. Create a folder where you will run your application. For example, c:\TSP.
3. Copy TSPClient.exe and Microsoft.ServiceBus.dll, both of which are in your TSPClient project's bin folder, to the c:\TSP folder.
4. At a command prompt, change directories to c:\TSP.
5. Run the following command.

        TSPClient

    Optionally, specify the number of minutes to sleep in between checking the queue, by passing in a command-line argument. The default sleep period for checking the queue is 3 minutes, which is used if no command-line argument is passed to TSPClient. If you want to use a different value for the sleep interval, for example, one minute, run the following command.

	    TSPClient 1

    The client will run until it sees a queue message of "Complete". Note that if you run multiple occurrences of the solver without running the client, you may need to run the client multiple times to completely empty the queue. Alternatively, you can delete the queue and then create it again. To delete the queue, run the following TSPSolver (not TSPClient)  command.

        TSPSolver deletequeue

## How to stop the .NET applications

For both the solver and client applications, you can press Ctrl+C to exit if you want to end prior to normal completion.

## Alternative to creating and deleting the queue with TSPSolver
Instead of using TSPSolver to create or delete the queue, you can create or delete the queue using the [Azure portal](https://manage.windowsazure.com). Visit the Service Bus section of the Azure portal to access the user interfaces for creating or deleting a queue, as well as for retrieving the connection string, issuer, and access key. You can also view a dashboard of your Service Bus queues, allowing you to view metrics for your incoming and outgoing messages.

[solver_output]: ./media/virtual-machines-dotnet-run-compute-intensive-task/WA_dotNetTSPSolver.png
[client_output]: ./media/virtual-machines-dotnet-run-compute-intensive-task/WA_dotNetTSPClient.png
[create_service_bus]: ./media/virtual-machines-dotnet-run-compute-intensive-task/ServiceBusCreateNew.png
[create_namespace_dialog]: ./media/virtual-machines-dotnet-run-compute-intensive-task/CreateNameSpaceDialog.png
[available_namespaces]: ./media/virtual-machines-dotnet-run-compute-intensive-task/AvailableNamespaces.png
[click_create]: ./media/virtual-machines-dotnet-run-compute-intensive-task/ClickCreate.png
[namespace_list]: ./media/virtual-machines-dotnet-run-compute-intensive-task/NamespaceList.png
[access_key_button]: ./media/virtual-machines-dotnet-run-compute-intensive-task/AccessKey.png
