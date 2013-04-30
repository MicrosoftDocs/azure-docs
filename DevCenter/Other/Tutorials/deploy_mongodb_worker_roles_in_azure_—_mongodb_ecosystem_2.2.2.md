
<properties linkid="develop-other-tutorials-deploy-mongodb-worker-roles" urlDisplayName="Deploy MongoDB Worker Roles in Windows Azure" pageTitle="Deploy MongoDB Worker Roles in Windows Azure" metaKeywords="MongoDB, 10gen, Windows Azure" metaDescription="Deploy MongoDB Worker Roles in Windows Azure" metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />

# Deploy MongoDB Worker Roles in Azure
*By [10gen Inc.][10gen-tutorial]*
 
The MongoDB Worker Role is currently a preview release. Please provide feedback at [mongodb-dev][1], [mongodb-user][2], or IRC #mongodb.

The MongoDB Worker Role project allows you to deploy and run a MongoDB replica set on Windows Azure. Replica set members are run as Azure worker role instances. MongoDB data files are stored in an Azure page blob mounted as a cloud drive. One can use any MongoDB driver to connect to the MongoDB server instance. The MongoDB [*.Net driver*][3] is included as part of the package.

## Get the Package

The MongoDB Azure Worker Role is delivered as a Visual Studio 2010 solution with associated source files. You can access the package at GitHub:

https://github.com/mongodb/mongo-azure/

It is recommended using the latest tagged version.

Alternatively, you can clone the repository run the following commands from a git bash shell:

    cd 
    git config --global core.autocrlf true
    git clone git@github.com:mongodb/mongo-azure.git
    cd mongo-azure
    git config core.autocrlf true
    

You must set the global setting for core.autocrlf to true before cloning the repository. After you clone the repository, we recommend you set the local setting for core.autocrlf to true (as shown above) so that future changes to the global setting for core.autocrlf do not affect this repository. If you then want to change your global setting for core.autocrlf to false run:

    git config --global core.autocrlf false
    

## Components

Once you have unzipped the package or cloned the repository, you will see the following directories:

*   Setup: Contains a file called solutionsetup.cmd. **Run this before opening the solution file.**
*   src: Contains all the project’s source code.
*   src/SampleApplications: Contains sample applications that you can use to demo MongoDB on Azure. [See the listing for more info][4].
*   lib: Library files. Includes the MongoDB .NET driver
*   Tools: Contains miscellaneous tools for the project.

## Initial Setup

We assume you’re running Windows x64 and Visual Studio. If not, install those first; Visual Studio 2010 or Visual Web Developer 2010 should work.

1.  Install the latest [Windows Azure SDK][5].
2.  Enable IIS on your local machine. This can be done by going to the “Turn Windows features on or off” control panel, under “Programs”. Check “Internet Information Services” and also check ASP.NET under World Wide Web Services|Application Development Features.
3.  Clone the project.
4.  **Before opening either solution file**, run Setupsolutionsetup.cmd.
5.  Open the solution you want, set the “MongoDB.WindowsAzure.(Sample.)Deploy” project as the StartUp Project, and run it!

The setup script does the following:

*   Creates the cloud configs for the 2 solutions
*   Downloads the MongoDB binaries to libMongoDBBinaries.

Note

The setup script downloads the **64-bit** version of MongoDB by default. If you are developing with **32-bit** Windows, you must download the latest 32-bit MongoDB binaries and place them in libMongoDBBinaries yourself. Do this after running solutionsetup.cmd so it won’t overwrite your work.

The prerequisites can be found in the [Github readme][6].

Once these are installed, you can open either solution MongoDB.WindowsAzure.sln for just the replica set and the monitoring application; MongoDB.WindowsAzure.Sample.sln for the replica set, monitoring application and a sample IIS app, MvcMovie, to test it.

## Deploy and Run

### Run Locally on Compute/Storage Emulator

The following instructions are for running the sample application.

To start, you can test out your setup locally on your development machine. The default configuration has 3 replica set members running on ports 27017, 27018 and 27019 with a replica set name of ‘rs’.

In Visual Studio, run the solution using F5 or Debug-&gt;Start Debugging. This will start up the replica set, the monitoring application and the MvcMovie sample application (if you are in the sample solution).

You can verify this by using the monitoring application or MvcMovie sample application in the browser or by running mongo.exe against the running instances.

### Deploy to Azure

Once you have the application running locally, you can deploy the sample app solution to Windows Azure. You cannot execute locally (on the compute emulator) with data stored in Blob store. This is due to the use of Windows Azure Drive which requires both compute and storage are in the same location.

## Additional Information

The MongoDB Worker Role runs mongod.exe with the following options:

    --dbpath --port --logpath --journal --nohttpinterface --logappend --replSet
    

MongoDB creates the following containers and blobs on Azure storage:

*   Mongo Data Blob Container Name - mongoddatadrive(replica set name)
*   Mongo Data Blob Name - mongoddblob(instance id).vhd

## FAQ/Troubleshooting

*   Can I run mongo.exe to connect?
    
    *   Yes if you set up remote desktop. Then you can connect to the any of the worker role instances and run e:approotMongoDBBinariesbinmongo.exe.
*   Role instances do not start on deploy to Azure
    
    *   Check if the storage URLs have been specified correctly.
*   Occasional socket exception using the .Net driver on Azure

*   My MongoDB instances are running fine on the worker roles. The included manager app shows the instances are working fine but my client app cannot connect.
    
    *   Ensure that the Instance Maintainer exe is deployed as part of the client role. You also need to change the Service Definition for the client role to have the InstanceMaintainer started on instance start.
        
        Refer to images below:
        
        Instance Maintainer deployed as part of role:
        
        ![http://docs.mongodb.org/_images/azure-worker-roles-instance-maintainer-1.png][7]
        Instance Maintainer start defined in service definition:
        
        ![http://docs.mongodb.org/_images/azure-worker-roles-instance-maintainer-2.png][8]

[10gen-tutorial]: http://docs.mongodb.org/ecosystem/tutorial/deploy-mongodb-worker-roles-in-azure/
 [1]: https://groups.google.com/forum/?fromgroups#!forum/mongodb-dev
 [2]: https://groups.google.com/forum/?fromgroups#!forum/mongodb-user
 [3]: http://docs.mongodb.org/drivers/csharp/#csharp-language-center
 [4]: https://github.com/mongodb/mongo-azure/tree/master/src/SampleApplications
 [5]: https://www.windowsazure.com/en-us/develop/net/
 [6]: https://github.com/mongodb/mongo-azure/blob/master/src/README.md
 [7]: http://docs.mongodb.org/_images/azure-worker-roles-instance-maintainer-1.png
 [8]: http://docs.mongodb.org/_images/azure-worker-roles-instance-maintainer-2.png  