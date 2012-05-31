<properties linkid="dev-net-common-tasks-team-foundation-service" urldisplayname="Team Foundation Service" headerexpose="" pagetitle="Continuous Delivery of a Cloud Service by Using Team Foundation Service" metakeywords="" footerexpose="" metadescription="" umbraconavihide="0" disquscomments="1"></properties>

# Continuous Delivery of a Cloud Service by Using Team Foundation Service Preview

Microsoft Team Foundation Service Preview is a cloud-hosted service version of Microsoft’s popular Team Foundation Server (TFS) software that provides highly customizable source code and build management, agile development and team process workflow, issue and work item tracking, and more.  You can configure your Team Foundation Service team projects to automatically build and deploy to Windows Azure websites or cloud services.  

This tutorial assumes you have Visual Studio 2012 RC installed. If you don’t already have Visual Studio 2012 RC, download it [here](http://www.microsoft.com/visualstudio/11/en-us/downloads).

To set up a cloud service to automatically build and deploy to Windows Azure by using Team Foundation Service Preview, follow these steps:

1.	Create a TFS account by navigating to [http://kudutfs.cloudapp.net](http://kudutfs.cloudapp.net).
 
2.	Create a team project by navigating to your TFS account page. Your account will have the form: http://&lt;username&gt;.kudutfs.cloudapp.net.  You will need to sign-in using a Microsoft Live ID account.<br/>
![][1]

3. Select Create a Team Project. Give a name and description to your project and click the **Create Project** button.<br/>
![][2]

4. When project creation is done, click the **Navigate to Project** button.<br/>
![][3]

5. Click the **Open new instance in Visual Studio** link to automatically launch Visual Studio connected to your team project. If you see any security dialog boxes, choose Allow.<br/>
![][4]

6. In Visual Studio, open the Windows Azure Application (Cloud Service) solution for your cloud service. Or, create a new Windows Azure Cloud Service project that targets .NET Framework 4. Add an ASP.NET MVC 4 web role, choose **Internet Application**, and a worker role.

7. Open the shortcut menu for the solution, and select **Add Solution to Source Control**.<br/>
![][5]

8. Accept or change the defaults and choose the **OK** button. Once the process completes, source control icons appear in Solution Explorer.<br/>
![][6]

9. Open the shortcut menu for the solution, and choose **Check In**.<br/>
![][7]

10. In the Pending Changes area of Team Explorer, type a comment for the check-in and choose the **Check In** button.<br/>
![][8]
<br/>
Note the options to include or exclude specific changes when you check in. If desired changes are excluded, choose the **Include All** link.<br/>
![][9]

11. Now that you have a TFS team project with some source code in it, you are ready to connect your team project to Windows Azure.  In the [Windows Azure Preview Portal](http://preview.azure.com), select your cloud service or create a new one by selecting the + icon at the bottom left and choosing **Cloud Service** and then **Quick Create**. Choose the **Set up Visual Studio Team Foundation Server publishing** link.<br/>
![][10]

12. In the wizard, type the name of your TFS account in the textbox and click the **Authorize Now** link.<br/>
![][11]

13. In the OAuth pop-up dialog, choose **Accept** to authorize Windows Azure to configure your team project in TFS.<br/>
![][12]

14. When authorization succeeds, you see a dropdown containing a list of your TFS team projects.  Select the name of team project that you created in the previous steps, and choose the wizard’s checkmark button.<br/>
![][13]

15. When your project is linked, you will see some instructions for checking in changes to your TFS team project.  On your next check-in, TFS will build and deploy your project to Windows Azure.  Try this now by clicking the **Check In from Visual Studio 2012** link, and then the **Launch Visual Studio 2012** link. (or the equivalent **Visual Studio** button in the command-bar).<br/>
![][14]

16. In Visual Studio’s Team Explorer, click the **Source Control Explorer** link.<br/>
![][15]

17. Navigate to your solution file and open it.<br/>
![][16]

18. In Solution Explorer, open up a file and change it. For example, change the file _Layout.cshtml under the Views\Shared folder in an MVC4 web role.<br/>
![][17]

19. Edit the logo for the site and hit Ctrl+S to save the file.<br/>
![][18]

20. In Team Explorer, choose the **Pending Changes** link.<br/>
![][19]

21. Type in a comment and choose the **Check In** button.<br/>
![][20]

22. Choose the Home button to return to the Team Explorer home page.<br/>
![][21]

23. Choose the **Builds** link to view the builds in progress.<br/>
![][22]
<br/>
The Team Explorer shows that a build has been triggered for your check-in.<br/>
![][23]

24. Double-click the name of the build in-progress to view a detailed log as the build progresses.<br/>
![][24]

24. While the build is in-progress, take a look at the build definition that was created when you linked TFS to Windows Azure by using the wizard.  Open the shortcut menu for the build definition and choose **Edit Build Definition**.<br/>
![][25]
<br/>
In the **Trigger** tab, you will see that the build definition is set to build on every check-in by default.<br/>
![][26]
<br/>
In the **Process** tab, you can see the deployment environment is set to the name of your cloud service.<br/>
![][27]

25.	By this time, your build should be completed successfully.<br/>
![][28]

26. If you double-click the build name, Visual Studio shows a **Build Summary**, including any test results from associated unit test projects.<br/>
![][29]

27. In the [Windows Azure Preview Portal](http://preview.azure.com), you can view the associated deployment.<br/>
![][30]

28.	Choose the URL in the **Quick Glance** section of the **Dashboard** page that shows the Staging environment. Deployments from continuous integration are published to the staging environment.<br/>
![][31]
<br/>
A new browser tab will open to reveal your running site.<br/>
![][32]

29.	If you make other changes to your project, you trigger more builds, and you will accumulate multiple deployments. The latest one marked as Active.<br/>
![][33]

30. Select an earlier deployment and click the **Redeploy** button to rewind your site to an earlier check-in.  Note that this will trigger a new build in TFS, and create a new entry in your deployment history.<br/>
![][34]

31. When you are ready, you can promote the staging environment to the production environment by choosing the Swap button. The newly deployed Staging environment is promoted to Production, and the previous Production enviroment, if any, becomes a Staging environment.<br/>
![][35]

For more information, see [Team Foundation Service](http://go.microsoft.com/fwlink/?LinkId=253861).
For information on how to set up a continuous build and deploy system using an on-premises Team Foundation Server, see [Continuous Delivery for Cloud Applications in Windows Azure](http://www.windowsazure.com/en-us/develop/net/common-tasks/continuous-delivey/).

[1]: ../../../DevCenter/dotNet/Media/tfs1.png
[2]: ../../../DevCenter/dotNet/Media/tfs2.png
[3]: ../../../DevCenter/dotNet/Media/tfs3.png
[4]: ../../../DevCenter/dotNet/Media/tfs4.png
[5]: ../../../DevCenter/dotNet/Media/tfs5.png
[6]: ../../../DevCenter/dotNet/Media/tfs6.png
[7]: ../../../DevCenter/dotNet/Media/tfs7.png
[8]: ../../../DevCenter/dotNet/Media/tfs8.png
[9]: ../../../DevCenter/dotNet/Media/tfs9.png
[10]: ../../../DevCenter/dotNet/Media/tfs10.png
[11]: ../../../DevCenter/dotNet/Media/tfs11.png
[12]: ../../../DevCenter/dotNet/Media/tfs12.png
[13]: ../../../DevCenter/dotNet/Media/tfs13.png
[14]: ../../../DevCenter/dotNet/Media/tfs14.png
[15]: ../../../DevCenter/dotNet/Media/tfs15.png
[16]: ../../../DevCenter/dotNet/Media/tfs16.png
[17]: ../../../DevCenter/dotNet/Media/tfs17.png
[18]: ../../../DevCenter/dotNet/Media/tfs18.png
[19]: ../../../DevCenter/dotNet/Media/tfs19.png
[20]: ../../../DevCenter/dotNet/Media/tfs20.png
[21]: ../../../DevCenter/dotNet/Media/tfs21.png
[22]: ../../../DevCenter/dotNet/Media/tfs22.png
[23]: ../../../DevCenter/dotNet/Media/tfs23.png
[24]: ../../../DevCenter/dotNet/Media/tfs24.png
[25]: ../../../DevCenter/dotNet/Media/tfs25.png
[26]: ../../../DevCenter/dotNet/Media/tfs26.png
[27]: ../../../DevCenter/dotNet/Media/tfs27.png
[28]: ../../../DevCenter/dotNet/Media/tfs28.png
[29]: ../../../DevCenter/dotNet/Media/tfs29.png
[30]: ../../../DevCenter/dotNet/Media/tfs30.png
[31]: ../../../DevCenter/dotNet/Media/tfs31.png
[32]: ../../../DevCenter/dotNet/Media/tfs32.png
[33]: ../../../DevCenter/dotNet/Media/tfs33.png
[34]: ../../../DevCenter/dotNet/Media/tfs34.png
[35]: ../../../DevCenter/dotNet/Media/tfs35.png