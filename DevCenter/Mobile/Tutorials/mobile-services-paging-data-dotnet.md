<properties linkid="mobile-services-pagin-data-dotnet" urldisplayname="Mobile Services" headerexpose="" pagetitle="Paging data in Windows Azure Mobile Services" metakeywords="access and change data, Windows Azure Mobile Services, mobile devices, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Validate and modify data sent to the Windows Azure Mobile Services from a Windows app." umbraconavihide="0" disquscomments="1"></properties>

# Validate and modify data in Mobile Services
Language: **C# and XAML**  

This topic shows you how to correctly handle data pages returned by Windows Azure Mobile Services in a Windows app. This tutorial is based on the sample app defined in the XXX tutorial.

1. Insert more data in a loop to setup data for paging

2. Display query using filter (maybe IE/FF/Chrome tools can be used instead to see the request)

3. Add explicit Take(n) to the query

4. Add <next> UI element to get the next page and add the Skip(k*n).Take(n) to the query

5. Insert even more data to show default paging

6. Add .IncludeTotalCount() to get total number of objects and display the number in the app

### <a name="next-steps"> </a>Next Steps

Some 

<!-- Anchors. -->

[Next Steps]:#next-steps

<!-- Images. -->


<!-- URLs. -->
[Get started with Mobile Services]: ./mobile-services-get-started#create-new-service/
[Get started with data]: ./mobile-services-get-started-with-data-dotnet/
[Get started with users]: ./mobile-services-get-started-with-users-dotnet/
[Get started with push notifications]: ./mobile-services-get-started-with-push-dotnet/
[JavaScript and HTML]: mobile-services-win8-javascript/
[WindowsAzure.com]: http://www.windowsazure.com/
[Management Portal preview]: https://manage.windowsazure.com/