<properties linkid="develop-net-architecture-load-testing" urlDisplayName="Load Testing" pageTitle="Load Testing in Windows Azure" metaKeywords="Load Testing Pattern Architecture" metaDescription="Load testing patterns and application architecture using Windows Azure." metaCanonical="http://www.windowsazure.com/en-us/develop/net/architecture" umbracoNaviHide="0" disqusComments="1" />
<div>
<div class="left-nav">
<div class="static-nav">
<ul>
<li class="menu-nodejs-compute"><a href="/en-us/develop/net/compute/">Compute</a></li>
<li class="menu-nodejs-data"><a href="/en-us/develop/net/data/">Data Services</a></li>
<li class="menu-nodejs-appservices"><a href="/en-us/develop/net/app-services/">App Services</a></li>
<li><a href="/en-us/develop/net/reference/">Reference</a></li>
<li><a href="/en-us/develop/net/guidance/">Guidance</a></li>
<li><a href="/en-us/develop/net/architecture/">Architecture</a></li>
<li><a href="/en-us/develop/net/samples/">Samples</a></li>
<li><a href="/en-us/develop/net/end-to-end-Apps/">Scenario-Based Tutorials</a></li>
</ul>
<ul class="links">
<li class="forum"><a href="/en-us/support/forums/">Forums</a></li>
</ul>
</div>
<div class="floating-nav jump-to"><br />
<ul>
<li>In this section (jump to):</li>
<li><a href="/en-us/develop/net/architecture/#overviews">Application architecture overviews</a></li>
<li><a href="/en-us/develop/net/architecture/multi-tenant-web-application-pattern/">Application pattern: Multitenant apps</a></li>
<li><strong>Application pattern: Load testing</strong></li>
<li><a href="/en-us/develop/net/architecture/#designpatterns">Design patterns</a></li>
</ul>
</div>
</div>
</div>

# Load Testing in Windows Azure

The primary goal of a load test is to simulate many users accessing a web application at the same time. The load test simulates multiple users opening simultaneous connections to the application and making multiple requests against an application or directly against a data repository such as SQL Azure. You can run a load test with a constant load pattern or an ever increasing load in order to determine the point at which response times become unacceptable or the application begins to generate errors. For example, one of the uses of a load test is to help determine if there is a point at which the application fails entirely. Because your goal is discovery of actual capacity rather than confirmation of a particular load level, you want to exceed the anticipated peak by a healthy margin. For example, you may have 1000 concurrent users during normal usage; but, you want to determine if you can handle anticipated growth to 2000 users. You can create a test that will ramp gradually to a peak of 3000 concurrent or more users. When the test is complete, you will know if tuning or enhancements are required to reliably handle potential peak loads plus a safety margin. Issues that can eventually come out as the result of load testing may include load balancing problems and processing capacity of the existing system.

A load test allows you to:

- **Quantify risk**: You can determine, through load testing, the likelihood that system performance will meet the stated performance expectations and service level agreement, such as response time requirements under given levels of load. This is a traditional Quality Assurance (QA) type test. Load testing does not mitigate risk directly, but through identification and quantification of risk and potential bottlenecks, presents tuning opportunities and an impetus for remediation that will mitigate risk. 
- **Determine minimum configuration**: You can conduct a capacity planning and determine, through load testing, the minimum configuration that will allow the system to meet performance expectations so that extraneous compute instances and storage can be minimized. This is a Business Technology Optimization (BTO) type test. 

Windows Azure provides value to your application in its ability to handle an elastic work load. To do so effectively you must know if your application is designed to scale effectively. The same elasticity that allows you to scale your cloud application enables to leverage Windows Azure to conduct load testing by: 

- Running the test agents as Windows Azure role instances or virtual machines which allows you to quickly create more of them and, thus, generate as much load as is necessary. 
- Allowing you to only deploy your test rig and its associated agents only when it needed. You only pay for the resources when you actually deploy the test rig and use the system. 

You can build your test rig using custom code or a variety of third party tools. Combining [Windows Azure and Visual Studio Ultimate][],  you can build a large, distributed test rig in a fast and automated way. Virtualization of computing resources eliminates the need for dedicated hardware for load testing. Different approaches and topologies can be used to provision a load test rig in Windows Azure.

Load tests are simulated with using a test controller and a set of test agents which are part of the load simulation architecture 

The basic method is to create one "controller" and one or more "agents." You have one controller, but as many agents as you require. You can scale out the load by adding additional agents, depending on the amount of load you are required to generate. Each agent generates a part of the load. The controller agents and records the results of the test. The recommended approach when running load that simulates realistic loads typically requires at least two computers: the first runs the controller, and the second runs the agent or agents. You also need a results repository, which could be hosted on same computer as controller, or on a different computer. A different computer is usually recommended for the repository.
 
![generic_rig][]

The advantages of adopting a load test harness hosted in Windows Azure are multiple:

- **Entry Cost**: The cost of doing load tests decreases greatly after the initial investment. Once deployed, the cost of the test rig depends on Windows Azure Pay-As-You-Go pricing model. 
- Maintenance Cost: you can create an easily maintain a test harness in Windows Azure. 
- **Elasticity**: The load test can be easily modified to accommodate different scenarios and conditions. For example, you can configure the Azure hosted test rig with a larger number of test agents. 
- **Repeatability**: After the initial investment, you can use the same artifacts (VS cloud project or VM images) to deploy a new test rig in Windows Azure, run a load test for the necessary time and undeploy it. 

With Windows Azure, you can host the controller and agent processes in different worker role instances.

The major components are:

- **Agents**: Using worker roles you take advantage of the elastic nature of Windows Azure compute instances to scale out the agents and generate the required load more easily.  
- **Controller**: The controller must communicate with the different agents in the rig. It starts and stops the tests in the different agents, tracks agent status and collects test results. It also collects performance data from the agents and the system being tested. You can use either a worker role or an on on-premise computer that communicates with the worker roles using Windows Azure Connect. For information on determining which configuration works best, see [Running Load Tests In Mixed Environments]. 
- **Windows Azure Connect**: The Windows Azure Connect endpoint software must be active on all Azure instances and on the Controller machine as well. This allows IP connectivity between them and, given that the firewall is properly configured, allows the Controller to send workloads to the agents. In parallel, and using the LAN, the Controller will collect the performance data on the stressed systems, using the traditional WMI mechanisms. 

The following diagram shows how applying the Windows Azure features to the test rig facilitates your implementation.

![implemented_rig][]

For a reference implementation of this architecture, see [Using Visual Studio Load Tests in Windows Azure Roles] by Paolo Salvatori and Sidney Higa which contains:

- Visual Studio Load Test in Windows Azure Overview<br/>
Describes the benefits of using Visual Studio Load Test and outlines the required steps. 
- Windows Azure Load Test Prerequisites and Setup<br/>
Lists the requirements for the solution. 
- Provisioning Windows Azure For a Load Test<br/>
Detailed instructions on how to set up the load test application before publishing. 
- Publishing the Load Test To Windows Azure<br/>
Describes the steps for publishing a Load Test to Azure. 
- Running Load Tests In Mixed Environments<br/>
A mixed environment is one in which the components of a load test (test controller, agents, results repository, and tested system) reside in different environments, such as on-premises and in Windows Azure. This document explains how you can proceed to configure such a scenario. 
- Performance Counters in Load Tests on Windows Azure<br/>
Collect performance counters from an application running in a separate hosted service 

<!--links-->

[Windows Azure and Visual Studio Ultimate]: http://www.microsoft.com/visualstudio/eng/products/visual-studio-ultimate-2012#product-edition-ultimate-details
[Running Load Tests In Mixed Environments]: http://msdn.microsoft.com/en-us/library/windowsazure/hh966776.aspx
[Using Visual Studio Load Tests in Windows Azure Roles]: http://msdn.microsoft.com/en-us/library/windowsazure/hh674491.aspx

<!--images-->

[generic_rig]: ..\media\architecture_load_testing_rig.png
[implemented_rig]: ..\media\architecture_load_testing_implementation.png