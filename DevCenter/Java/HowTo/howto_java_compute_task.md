<properties umbracoNaviHide="0" pageTitle="" metaKeywords="Windows Azure virtual machine, Azure virtual machine, Azure java worker load, Azure java service bus, Azure java compute intensive" metaDescription="With Windows Azure, you can use a virtual machine to handle compute-intensive tasks; for example, a virtual machine could handle tasks and deliver results to client machines or mobile applications." linkid="dev-java-compute-load" urlDisplayName="Java compute load" headerExpose="" footerExpose="" disqusComments="1" />

# How to run a compute-intensive task in Java on a virtual machine

With Windows Azure, you can use a virtual machine to handle compute-intensive tasks; for example, a virtual machine could handle tasks and deliver results to client machines or mobile applications. On completing this guide, you will have an understanding of how to create a virtual machine that runs a compute-intensive Java application that can be monitored by another Java application.

This tutorial assumes you know how to create Java console applications, import libraries to your Java application, and generate a Java archive (JAR). No knowledge of Windows Azure is assumed. 

You will learn:

* How to create a virtual machine.
* How to remotely log in to your virtual machine.
* How to install a JRE or JDK on your virtual machine.
* How to create a service bus namespace.
* How to create a Java application that performs a compute-intensive task.
* How to create a Java application that monitors the progress of the compute-intensive task.
* How to run the Java applications.

This tutorial will use the Traveling Salesman Problem for the compute-intensive task. The following is an example of the Java application running the compute-intensive task:

![Traveling Salesman Problem solver][solver_output]

The following is an example of the Java application monitoring the compute-intensive task:

![Traveling Salesman Problem client][client_output]

## To create a virtual machine

1. Log in to the [Windows Azure Preview Management Portal](https://manage.windowsazure.com).
2. Click **New**.
3. Click **Virtual machine**.
4. Click **Quick create**.
5. In the **Create a virtual machine** screen, enter a value for **DNS name**.
6. From the **Image** dropdown list, select an image, such as **Windows Server 2008 R2 SP1**.
7. Enter a password in the **New password** field, and re-enter it in the **Confirm** field. Remember this password, you will use it when you remotely log in to the virtual machine.
8. From the **Location** drop down list, select the data center location for your virtual machine; for example, **West US**.
9. Click **Create virtual machine**. Your virtual machine will be created. You can monitor the status in the **Virtual machines** section of the management portal.

## To remotely log in to your virtual machine

1. Log on to the [Preview Management Portal](https://manage.windowsazure.com).
2. Click **Virtual machines**.
3. Click the name of the virtual machine that you want to log in to.
4. Click **Connect**.
5. Respond to the prompts as needed to connect to the virtual machine. When prompted for the password, use the password that you provided when you created the virtual machine.

## To install a JRE or JDK on your virtual machine

To run Java applications on your virtual machine, you need to install install a Java Runtime Environment (JRE). For purposes of this tutorial, we'll install a Java Developer Kit (JDK) to your virtual machine and use the JDK's JRE. You could however install a JRE only if you choose to do so. 

For purposes of this tutorial, a JDK will be installed from Oracle's site.

1. Log on to your virtual machine.
2. Within your browser, open [http://www.oracle.com/technetwork/java/javase/downloads/index.html](http://www.oracle.com/technetwork/java/javase/downloads/index.html).
3. Click the **Download** button for the JDK that you want to download. For purposes of this tutorial, the **Download** button for the Java SE 6 Update 32 JDK was used.
4. Accept the license agreement.
5. Click the download executable for **Windows x64 (64-bit)**.
6. Follow the prompts and respond as needed to install the JDK to your virtual machine. 

Note that the Service Bus functionality requires the GTE CyberTrust Global Root certificate to be installed as part of your JRE's **cacerts** store. This certificate is automatically included in the JRE used by this tutorial. If you do not have this certificate in your JRE **cacerts** store, it can be installed by copying the certificate contents from <https://secure.omniroot.com/cacert/ct_root.der>, saving the contents to a **.cer** file, and adding it to the **cacerts** store via **keytool**. For more detailed instructions on adding a certificate to the **cacerts** store, see [Adding a Certificate to the Java CA Certificate Store][add_ca_cert].

## How to create a service bus namespace

To begin using Service Bus queues in Windows Azure, you must first
create a service namespace. A service namespace provides a scoping
container for addressing Service Bus resources within your application.

To create a service namespace:

1.  Log on to the [Windows Azure Management Portal](http://windows.azure.com) (note this is not the same portal as the Windows Azure Preview Management Portal).
2.  In the lower left navigation pane of the Management Portal, click
    **Service Bus, Access Control & Caching**.
3.  In the upper left pane of the Management Portal, click the **Service
    Bus** node, and then click the **New** button.  
    ![Service Bus Node screenshot][svc_bus_node]
4.  In the **Create a new Service Namespace** dialog, enter a
    **Namespace**, and then to make sure that it is unique, click the
    **Check Availability** button.  
    ![Create a New Namespace screenshot][create_namespace]
5.  After making sure the namespace name is available, choose the
    country or region in which your namespace should be hosted (make
    sure you use the same country/region in which you are deploying your
    compute resources), and then click the **Create Namespace** button.
    Having a compute instance is optional, and the service bus can be
    consumed from any application with internet access.  
      
     The namespace you created will then appear in the Management Portal
    and takes a moment to activate. Wait until the status is **Active**
    before moving on.

## Obtain the Default Management Credentials for the Namespace

In order to perform management operations, such as creating a queue, on
the new namespace, you need to obtain the management credentials for the
namespace.

1.  In the left navigation pane, click the **Service Bus** node, to
    display the list of available namespaces:   
    ![Available Namespaces screenshot][avail_namespaces]
2.  Select the namespace you just created from the list shown:   
    ![Namespace List screenshot][namespace_list]
3.  The right-hand **Properties** pane will list the properties for the
    new namespace:   
    ![Properties Pane screenshot][properties_pane]
4.  The **Default Key** is hidden. Click the **View** button to display
    the security credentials:   
    ![Default Key screenshot][default_key]
5.  Make a note of the **Default Issuer** and the **Default Key** as you
    will use this information below to perform operations with the
    namespace. Specifically, the value for **Default Issuer** will be assigned to the *issuer* variable and the value for **Default Key** will be assigned to the *key* variable in the two Java programs, **TSPSolver.java** and **TSPClient.java**.


## How to create a Java application that performs a compute-intensive task

1. On your development machine (which does not have to be the virtual machine that you created), download the [Windows Azure SDK for Java](http://www.windowsazure.com/en-us/develop/java/java-home/download-the-windows-azure-sdk-for-java/). Include the dependencies.
2. Create a Java console application using the following Java program. For purposes of this tutorial, we'll use **TSPSolver.java** as the Java file name. Modify the **your\_service\_bus\_namespace**, **your\_service\_bus\_owner**, and **your\_service\_bus\_key** placeholders to use your service bus **namespace**, **Default Issuer** and **Default Key** values, respectively.

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
            
            private static void buildDistances(String fileLocation, int numCities){
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
                    System.err.println("Error: "+e.getMessage());
                }
            }
            
            private static void permutation(List<Integer> startCities, double distSoFar, List<Integer> restCities){
        
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
            
            private static void newBestDistance(List<Integer> cities, double distance){
                minDistance = distance;
                String cityList = "Shortest distance is "+minDistance+", with route: " ;
                for (int i = 0; i<bestOrder.length; i++){
                    bestOrder[i] = cities.get(i);
                    cityList += cityNames[bestOrder[i]];
                    if (i != bestOrder.length -1)
                        cityList += ", ";
                }
                System.out.println(cityList);       
                try 
                {
                    service.sendQueueMessage("TSPQueue", new BrokeredMessage(cityList));
                } 
                catch (ServiceException e) 
                {
                    e.printStackTrace();
                }
            }
            
            public static void main(String args[]){
                
                try {
                    
                    Configuration config = ServiceBusConfiguration.configureWithWrapAuthentication(
                            "your_service_bus_namespace", "your_service_bus_owner", "your_service_bus_key");
                    
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
                    System.out.println("Final Solution Found!!");
                    service.sendQueueMessage("TSPQueue", new BrokeredMessage("Complete"));
                } 
                catch (ServiceException e) 
                {
                    e.printStackTrace();
                }
            }
            
        }

3. Export the application to a runnable Java archive (JAR), and package the required libraries into the generated JAR. For purposes of this tutorial, we'll use **TSPSolver.jar** as the generated JAR name.

## How to create a Java application that monitors the progress of the compute-intensive task

1. On your development machine, create a Java console application using the following Java program. For purposes of this tutorial, we'll use **TSPClient.java** as the Java file name. As above, modify the **your\_service\_bus\_namespace**, **your\_service\_bus\_owner**, and **your\_service\_bus\_key** placeholders to use your service bus **namespace**, **Default Issuer** and **Default Key** values, respectively.service bus **Namespace**,  **Default Issuer** and **Default Key** values, respectively.
  
        import java.util.Date;
        import java.text.DateFormat;
        import java.text.SimpleDateFormat;
        import com.microsoft.windowsazure.services.serviceBus.*;
        import com.microsoft.windowsazure.services.serviceBus.models.*;
        import com.microsoft.windowsazure.services.core.*;
        
        public class TSP_Client 
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
                                namespace, issuer, key);
                        
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
                catch (ServiceException serviceException)
                {
                    // Take action as needed.
                    System.out.println("ServiceException encountered: " + serviceException.getMessage());
                }
                catch (Exception exception)
                {
                    // Take action as needed.
                    System.out.println("Exception encountered: " + exception.getMessage());
                }
        
            }
        
        }
  

2. Export the application to a runnable Java archive (JAR), and package the required libraries into the generated JAR. For purposes of this tutorial, we'll use **TSPClient.jar** as the generated JAR name.

## How to run the Java applications
Run the compute-intensive application, first to create the queue, then to solve the Traveling Saleseman Problem, hich will add the current best route to the service bus queue. While the compute-intensive application is running (or afterwards), run the client to display results frm the service bus queue.

### How to run the compute-intensive application

1. Log on to your virtual machine.
2. Create a folder where you will run your application. For example, **c:\TSP**.
3. Copy **TSPSolver.jar** to **c:\TSP**,
4. Create a file named **c:\TSP\cities.txt** with the following contents:

        Montgomery, -5961.513053174005, 2236.041995790761
        Phoenix, -7743.816805421991, 2311.143387140668
        Little Rock, -6379.680295493998, 2400.107649091518
        Sacramento, -8392.976246048636, 2664.025175599511
        Denver, -7253.950856881725, 2745.804158594989
        Hartford, -5021.665661504875, 2885.918649422432
        Dover, -5218.571378956087, 2705.918982955634
        Tallahassee, -5822.883103442604, 2104.087378276678
        Atlanta, -5830.983188276846, 2332.669657971635
        Boise, -8031.517819952500, 3013.520309123051
        Springfield, -6194.452160039679, 2748.850123533770
        Indianapolis, -5952.431602606583, 2749.381607390675
        Des Moines, -6468.796015143020, 2873.753597507381
        Topeka, -6611.764205311191, 2697.494770355825
        Frankfort, -5863.673038451106, 2639.266056784030
        Baton Rouge, -6297.394751448061, 2104.521990010939
        Augusta, -4820.477118340399, 3062.564135916582
        Annapolis, -5285.898333341956, 2692.861560524212
        Boston, -4907.692361717428, 2918.269239880439
        Lansing, -5841.810479017491, 2952.699609861697
        Saint Paul, -6432.391858388964, 3105.850151831310
        Jackson, -6232.912672886473, 2233.171900048675
        Jefferson City, -6369.879835434252, 2665.223916295487
        Helena, -7740.582230045847, 3219.568143135753
        Lincoln, -6679.847273561608, 2819.784977174988
        Carson City, -8274.473794501402, 2705.851821969037
        Concord, -4943.734526281372, 2986.321076890174
        Trenton, -5165.325084707952, 2779.147950873629
        Santa Fe, -7321.692799832930, 2464.451052653001
        Albany, -5097.970699342989, 2947.609263108960
        Raleigh, -5433.544921906798, 2471.621040737659
        Bismarck, -6963.392322020205, 3372.790406405869
        Columbus, -5734.984918510500, 2761.217902130590
        Oklahoma City, -6739.245293075994, 2451.673744048398
        Salem, -8500.781583088507, 3104.544865619558
        Harrisburg, -5311.771619759177, 2782.467859396325
        Providence, -4934.959722276215, 2889.826009290865
        Columbia, -5599.167231449393, 2349.252617625462
        Pierre, -6932.808784104642, 3065.634125418163
        Nashville, -5996.398210823769, 2498.844732836025
        Austin, -6754.101275673204, 2091.295490486712
        Salt Lake City, -7731.295150778718, 2815.973107515895
        Montpelier, -5014.406470916412, 3058.615664127341
        Richmond, -5352.150228272597, 2593.851272519408
        Olympia, -8491.378906773456, 3250.427165468564
        Charleston, -5640.506753379088, 2649.784006231465
        Madison, -6176.077618882252, 2976.276570940856
        Cheyenne, -7241.366808852755, 2842.979010077474

5. At a command prompt, change directories to c:\TSP.
6. Ensure the JRE's bin folder is in the PATH environment variable.
7. You'll need to create the service bus queue before you run the TSP solver permutations. Run the following command to create the service bus queue:

        java -jar TSPSolver.jar createqueue

8. Now that the queue is created, you can run the TSP solver permutations. For example, run the following command to run the solver for 8 cities. 

        java -jar TSPSolver.jar 8

 If you don't specify a number, it will run for 10 cities. The larger the number that you specify, the longer the solver will run.
 <p>At this point, the queue should be populated.

### How to run the monitoring client application
1. Log on to your machine where you will run the client application. This does not need to be the same machine running the **TSPSolver** application, although it can be.
2. Create a folder where you will run your application. For example, **c:\TSP**.
3. Copy **TSPClient.jar** to **c:\TSP**,
4. Create a file named **c:\TSP\cities.txt** using the same contents as used for the compute-intensive application.
5. Ensure the JRE's bin folder is in the PATH environment variable.
6. At a command prompt, change directories to c:\TSP.
7. Run the following command:

        java -jar TSPClient.jar

The client will run until it sees a queue message of "Complete". Note that if you run multiple occurrences of the solver without running the client, you may need to run the client multiple times to completely empty the queue. Alternatively, you can delete the queue and then create it again.

To delete the queue, run 

        java -jar TSPSolver.jar deletequeue

The solver will run until it finishes examining all routes.
For both the solver and client applications, you can press **Ctrl+C** to exit if you want to end prio to normal completion.


[solver_output]: ../media/WA_JavaTSPSolver.png
[client_output]: ../media/WA_JavaTSPClient.png
[svc_bus_node]: ../media/SvcBusQueues_02_SvcBusNode.jpg
[create_namespace]: ../media/SvcBusQueues_03_CreateNewSvcNamespace.jpg
[avail_namespaces]: ../media/SvcBusQueues_04_SvcBusNode_AvailNamespaces.jpg
[namespace_list]: ../media/SvcBusQueues_05_NamespaceList.jpg
[properties_pane]: ../media/SvcBusQueues_06_PropertiesPane.jpg
[default_key]: ../media/SvcBusQueues_07_DefaultKey.jpg
[add_ca_cert]: add_ca_cert.md

