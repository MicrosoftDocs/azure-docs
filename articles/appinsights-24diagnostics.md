<properties title="Search diagnostic logs with Application Insights" pageTitle="Search diagnostic logs" description="Search logs generated with Trace, NLog, or Log4Net." metaKeywords="analytics web test" authors="awills"  />
 
# Search diagnostic logs with Application Insights

You can capture and search diagnostic data from System.Diagnostics.Trace, NLog, and Log4Net. Application Insights provides an efficient and easy-to-use tool for collecting and investigating logged events from one or more sources, complementing the application health monitoring features.

The monitored web application can be hosted on-premise or in a virtual machine, or it can be a Microsoft Azure website.

1. [Add a logging adapter](#add)
+ [Configure diagnostics collection](#configure)
+ [Insert log statements, build and deploy](#deploy)
+ [View log data](#view)
+ [Search the data](#search)
+ [Next steps](#next)



## <a name="add"></a>1. Add a logging adapter

1. If you haven't done this already, add Application Insights to your [existing] or [new][setup] web service project in Visual Studio. 

    If you add Application Insights after you add logging to your project, you'll find that the logging adapter has already been set up and configured - just [redeploy your project](#deploy) and [view your data](#view).

2. In Solution Explorer, in the context menu of your project, choose **Manage NuGet Packages**.
3. Select Online > All, select **Include Prerelease** and search for "Microsoft.ApplicationInsights"

    ![Get the prerelease version of the appropriate adapter](./media/appinsights/appinsights-36nuget.png)


4. Select the prerelease version of the appropriate package - one of:
  + Microsoft.ApplicationInsights.TraceListener
  + Microsoft.ApplicationInsights.NLogTarget
  + Microsoft.ApplicationInsights.Log4NetAppender

## <a name="configure"></a>2. Configure diagnostics collection

### For System.Diagnostics.Trace

In Web.config, insert the following code into the `<configuration>` section:

    <system.diagnostics>
     <trace autoflush="true" indentsize="0">
      <listeners>
       <add name="myAppInsightsListener"  
          type="Microsoft.ApplicationInsights.TraceListener.ApplicationInsightsTraceListener, 
         Microsoft.ApplicationInsights.TraceListener" />
      </listeners>
     </trace>
    </system.diagnostics> 

### For NLog

In Nlog.config, merge the following snippets into the `<extensions>`, `<targets>` and `<rules>` sections. Create those sections if necessary.

    <extensions> 
     <add  assembly="Microsoft.ApplicationInsights.NLogTarget" /> 
    </extensions> 
    
    <targets>
     <target xsi:type="ApplicationInsightsTarget" name="aiTarget"/>
    </targets>
    
    <rules>
     <logger name="*" minlevel="Trace" writeTo="aiTarget"/>
    </rules>
    
### For Log4Net

In Web.config, merge these snippets into the `<configsections>` and `<log4net>` sections:

    <configSections>
      <section name="log4net" type="log4net.Config.Log4NetConfigurationSectionHandler, log4net" />
    </configSections>
    
    <log4net>
     <root>
      <level value="ALL" /> <appender-ref ref="aiAppender" />
     </root>
     <appender name="aiAppender" type="Microsoft.ApplicationInsights.Log4NetAppender.ApplicationInsightsAppender, Microsoft.ApplicationInsights.Log4NetAppender">
      <layout type="log4net.Layout.PatternLayout">
       <conversionPattern value="%date [%thread] %-5level %logger - %message%newline" />
      </layout>
     </appender>
    </log4net>


## <a name="deploy"></a>3. Insert log statements, build and deploy

Insert event logging calls using your chosen logging framework. For example if you use Log4Net, you might have calls like

    log.Warn("Slow response - database01");

Logged events will be sent to Application Insights both in development and in operation.

## <a name="view"></a>4. View log data

In Application Insights, open diagnostic search.

![Open diagnostic search](./media/appinsights/appinsights-30openDiagnostics.png)

Select any log event to see its detail. 

![Open diagnostic search](./media/appinsights/appinsights-32detail.png)

The available fields depend on the logging framework and the parameters you used in the call.

You can use plain strings (without wildcards) to filter the field data within an item.


## <a name="search"></a>5. Search the data

Set a time range and search for terms. Searches over a shorter range are faster. 

![Open diagnostic search](./media/appinsights/appinsights-31search.png)

Notice that you search for terms, not substrings. Terms are alphanumeric strings including some punctuation such as '.' and '_'. For example:

<table>
  <tr><th>term</th><th>is NOT matched by</th><th>but these do match</th></tr>
  <tr><td>HomeController.About</td><td>about<br/>home</td><td>h*about<br/>home*</td></tr>
  <tr><td>IsLocal</td><td>local<br/>is<br/>*local</td><td>isl*<br/>islocal<br/>i*l</td></tr>
  <tr><td>New Delay</td><td>w d</td><td>new<br/>delay<br/>n* AND d*</td></tr>
</table>

Here are the search expressions you can use:

<table>
                    <tr>
                      <th>
                        <p>Sample query</p>
                      </th>
                      <th>
                        <p>Effect</p>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span class="code">slow</span>
                        </p>
                      </td>
                      <td>
                        <p>Find all events in the date range whose fields include the term "slow"</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span class="code">database??</span>
                        </p>
                      </td>
                      <td>
                        <p>Matches database01, databaseAB, ...</p>
                        <p>? is not allowed at the start of a search term.</p>
                      </td>
                    </tr>
                     <tr>
                      <td>
                        <p>
                          <span class="code">database*</span>
                        </p>
                      </td>
                      <td>
                        <p>Matches database, database01, databaseNNNN</p>
                        <p>* is not allowed at the start of a search term</p>
                      </td>
                    </tr>
                   <tr>
                      <td>
                        <p>
                          <span class="code">apple AND banana</span>
                        </p>
                      </td>
                      <td>
                        <p>Find events that contain both terms. Use capital "AND", not "and".</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span class="code">apple OR banana</span>
                        </p>
                        <p>
                          <span class="code">apple banana</span>
                        </p>
                      </td>
                      <td>
                        <p>Find events that contain either term. Use "OR", not "or".</p>
                        <p>Short form.</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span class="code">apple NOT banana</span>
                        </p>
                        <p>
                          <span class="code">apple -banana</span>
                        </p>
                      </td>
                      <td>
                        <p>Find events that contain one term but not the other.</p>
                        <p>Short form.</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>app* AND banana NOT (grape OR pear)</p>
                        <p>
                          <span class="code">app* AND banana -(grape pear)</span>
                        </p>
                      </td>
                      <td>
                        <p>Logical operators and bracketing.</p>
                        <p>Shorter form.</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span class="code">message:slow</span>
                        </p>
                        <p>
                          <span class="code">ipaddress:(10.0.0.* OR 192.168.0.*)</span>
                        </p>
                        <p>
                          <span class="code">properties.logEventInfo.level:Error</span>
                        </p>
                      </td>
                      <td>
                        <p>Match the specified field. By default, all fields are searched. To see what fields are available, select an event to look at its detail.</p>
                      </td>
                    </tr>
</table>

## <a name="add"></a>Next steps
* [Set up monitoring in a new project][setup]
* [Add monitoring to an existing project][existing]
* [Set up availability and responsiveness tests][web tests]
* [Troubleshooting][trouble]
* [Application Insights SDK](../appinsights-90SDK/)


<!--Link references-->
[setup]: ../appinsights-01-start/
[existing]: ../appinsights-02-existing/
[web tests]: ../appinsights-10Avail/
[trouble]: ../appinsights-09qna/



