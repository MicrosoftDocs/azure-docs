<properties
    pageTitle="Load test your application by using Visual Studio Team Services | Microsoft Azure"
    description="Learn how to stress test your Azure Service Fabric applications by using Visual Studio Team Services."
    services="service-fabric"
    documentationCenter="na"
    authors="cawams"
    manager="timlt"
    editor="" />

<tags
    ms.service="multiple"
    ms.devlang="dotnet"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="multiple"
    ms.date="07/29/2016"
    ms.author="cawa" />

# Load test your application by using Visual Studio Team Services

This article shows how to use Microsoft Visual Studio load test features to stress test an application. It uses an Azure Service Fabric stateful service back end and a stateless service web front end. The example application used here is an airplane location simulator. You provide an airplane ID, departure time, and destination. The application’s back end processes the requests, and the front end displays on a map the airplane that matches the criteria.

The following diagram illustrates the Service Fabric application that you'll be testing.

![Diagram of the example airplane location application][0]

## Prerequisites
Before getting started, you need to do the following:

- Get a Visual Studio Team Services account. You can get one for free at [Visual Studio Team Services](https://www.visualstudio.com).
- Get and install Visual Studio 2013 or Visual Studio 2015. This article uses Visual Studio 2015 Enterprise edition, but Visual Studio 2013 and other editions should work similarly.
- Deploy your application to a staging environment. See [How to deploy applications to a remote cluster using Visual Studio](service-fabric-publish-app-remote-cluster.md) for information about this.
- Understand your application’s usage pattern. This information is used to simulate the load pattern.
- Understand the goal for your load testing. This helps you interpret and analyze the load test results.

## Create and run the Web Performance and Load Test project

### Create a Web Performance and Load Test project

1. Open Visual Studio 2015. Choose **File** > **New** > **Project** on the menu bar to open the **New Project** dialog box.

2. Expand the **Visual C#** node and choose **Test** > **Web Performance and Load Test project**. Give the project a name and then choose the **OK** button.

    ![Screen shot of the New Project dialog box][1]

    You should see a new Web Performance and Load Test project in Solution Explorer.

    ![Screen shot of Solution Explorer showing the new project][2]

### Record a web performance test

1. Open the .webtest project.

2. Choose the **Add Recording** icon to start a recording session in your browser.

    ![Screen shot of the Add Recording icon in a browser][3]

    ![Screen shot of the Record button in a browser][4]

3. Browse to the Service Fabric application. The recording panel should show the web requests.

    ![Screen shot of web requests in the recording panel][5]

4. Perform a sequence of actions that you expect the users to perform. These actions are used as a pattern to generate the load.

5. When you're done, choose the **Stop** button to stop recording.

    ![Screen shot of the Stop button][6]

    The .webtest project in Visual Studio should have captured a series of requests. Dynamic parameters are replaced automatically. At this point, you can delete any extra, repeated dependency requests that are not part of your test scenario.

6. Save the project and then choose the **Run Test** command to run the web performance test locally and make sure everything works correctly.

    ![Screen shot of the Run Test command][7]

### Parameterize the web performance test

You can parameterize the web performance test by converting it to a coded web performance test and then editing the code. As an alternative, you can bind the web performance test to a data list so that the test iterates through the data. See [Generate and run a coded web performance test](https://msdn.microsoft.com/library/ms182552.aspx) for details about how to convert the web performance test to a coded test. See [Add a data source to a web performance test](https://msdn.microsoft.com/library/ms243142.aspx) for information about how to bind data to a web performance test.

For this example, we'll convert the web performance test to a coded test so you can replace the airplane ID with a generated GUID and add more requests to send flights to different locations.

### Create a load test project

A load test project is composed of one or more scenarios described by the web performance test and unit test, along with additional specified load test settings. The following steps show how to create a load test project:

1. On the shortcut menu of your Web Performance and Load Test project, choose **Add** > **Load Test**. In the **Load Test** wizard, choose the **Next** button to configure the test settings.

2. In the **Load Pattern** section, choose whether you want a constant user load or a step load, which starts with a few users and increases the users over time.

    If you have a good estimate of the amount of user load and want to see how the current system performs, choose **Constant Load**. If your goal is to learn whether the system performs consistently under various loads, choose **Step Load**.

3. In the **Test Mix** section, choose the **Add** button and then select the test that you want to include in the load test. You can use the **Distribution** column to specify the percentage of total tests run for each test.

4. In the **Run Settings** section, specify the load test duration.

    >[AZURE.NOTE] The **Test Iterations** option is available only when you run a load test locally using Visual Studio.

5. In the **Location** section of **Run Settings**, specify the location where load test requests are generated. The wizard may prompt you to log in to your Team Services account. Log in and then choose a geographic location. When you're done, choose the **Finish** button.

6. After the load test is created, open the .loadtest project and choose the current run setting, such as **Run Settings** > **Run Settings1 [Active]**. This opens the run settings in the **Properties** window.

7. In the **Results** section of the **Run Settings** properties window, the **Timing Details Storage** setting should have **None** as its default value. Change this value to **All Individual Details** to get more information on the load test results. See [Load Testing](https://www.visualstudio.com/load-testing.aspx) for more information on how to connect to Visual Studio Team Services and run a load test.

### Run the load test by using Visual Studio Team Services

Choose the **Run Load Test** command to start the test run.

![Screen shot of the Run Load Test command][8]

## View and analyze the load test results

As the load test progresses, the performance information is graphed. You should see something similar to the following graph.

![Screen shot of performance graph for load test results][9]

1. Choose the **Download report** link near the top of the page. After the report is downloaded, choose the **View report** button.

    On the **Graph** tab you can see graphs for various performance counters. On the **Summary** tab, the overall test results appear. The **Tables** tab shows the total number of passed and failed load tests.

2. Choose the number links on the **Test** > **Failed** and the **Errors** > **Count** columns to see error details.

    The **Detail** tab shows virtual user and test scenario information for failed requests. This data can be useful if the load test includes multiple scenarios.

See [Analyzing Load Test Results in the Graphs View of the Load Test Analyzer](https://www.visualstudio.com/load-testing.aspx) for more information on viewing load test results.

## Automate your load test

Visual Studio Team Services Load Test provides APIs to help you manage load tests and analyze results in a Team Services account. See [Cloud Load Testing Rest APIs](http://blogs.msdn.com/b/visualstudioalm/archive/2014/11/03/cloud-load-testing-rest-apis-are-here.aspx) for more information.

## Next steps
- [Monitoring and diagnosing services in a local machine development setup](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)

[0]: ./media/service-fabric-vso-load-test/OverviewDiagram.png
[1]: ./media/service-fabric-vso-load-test/NewProjectDialog.png
[2]: ./media/service-fabric-vso-load-test/Project.png
[3]: ./media/service-fabric-vso-load-test/AddRecording.png
[4]: ./media/service-fabric-vso-load-test/AddRecording2.png
[5]: ./media/service-fabric-vso-load-test/ActionSequence.png
[6]: ./media/service-fabric-vso-load-test/StopRecording.png
[7]: ./media/service-fabric-vso-load-test/RunTest.png
[8]: ./media/service-fabric-vso-load-test/RunTest2.png
[9]: ./media/service-fabric-vso-load-test/Graph.png
