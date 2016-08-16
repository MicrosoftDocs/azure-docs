<properties 
    pageTitle="Azure RemoteApp - testing your network bandwidth usage with some common scenarios | Microsoft Azure"
	description="Learn how about common usage scenarios that can help you figure out your network bandwidth needs for Azure RemoteApp."
	services="remoteapp"
	documentationCenter="" 
	authors="lizap" 
	manager="mbaldwin" />

<tags 
    ms.service="remoteapp" 
    ms.workload="compute" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="08/15/2016" 
    ms.author="elizapo" />
    
# Azure RemoteApp - testing your network bandwidth usage with some common scenarios

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.

As we discussed in [Estimate Azure RemoteApp network bandwidth usage](remoteapp-bandwidth.md), the best way to figure out what the impact of Azure RemoteApp to your network is to run some usage tests. Run these tests for a set time period and measure the bandwidth needed for each scenario. If you have the capability, you can also measure the network packet loss and network jitter to understand the network patterns that will be created in your specific environment.

    
When evaluating the bandwidth usage, remember that usage varies between different users within your company. For example, text readers and writers usually consume less bandwidth than users that work with video. For best results, study your own user needs and create a mix of the following scenarios that best represents the users in your company. Remember to [review the factors that impact bandwidth usage and user experience](remoteapp-bandwidthexperience.md) - that will help you identify the ideal tests.

First read about the tests, pick your mix, and then run them. You can use the table below to help track performance.

>[AZURE.NOTE] If you cannot do your own network testing, or you do not have the time to do so, check out our [basic network bandwidth estimates/recommendations](remoteapp-bandwidthguidelines.md). Your mileage may vary, however, so if you *can* run your own tests, you should.


## The usage tests
Each of these tests run for different amounts of time and test different functions/features that consume network bandwidth. Remember to choose the mix of test that best matches your individual company users.
 
### Executive/complex PowerPoint - Run for 900-1000 seconds

A user presents between 45-50 high-fidelity slides by using Microsoft Office PowerPoint in full-screen mode. The slides should contain images, transitions (with animations), and backgrounds with color gradient that are typical for your company. The user should spend at least 20 seconds on each slide.
    
This scenario creates bursty traffic, when a slide transitions to the next slide in the presentation.
    
### Simple PowerPoint - Run for ~620 seconds

A user presents a simple PowerPoint file with approximately 30 slides by using Microsoft Office PowerPoint in full-screen mode. The slides are more text-intensive than in the Executive/complex PowerPoint scenario and have simpler backgrounds and images (black diagrams). 
    
### Internet Explorer - Run for ~250 seconds

A user browses the web by using Internet Explorer. The user browses and scrolls through a mix of text, natural images, and some schematic diagrams. The web pages stored on the local disk drive of the Remote Desktop Session Host (RD Session Host) server as an .MHT file. The user scrolls using Page Up, Page Down, Up, and Down keys, with varying intervals for each key/type of scroll:
    
    - Down - 250 keystrokes very 500 ms
    - Page Up - 36 keystrokes every 1000 ms
    - Down - 75 keystrokes every 100 ms
    - Page Down - 20 keystrokes every 500 ms
    - Up - 120 keystrokes every 300 ms
    
### PDF document - simple - Run for ~610 seconds
A user reads and searches a PDF document in various ways by using Adobe Acrobat Reader. The document should consist of tables, simple graphs, and multiple text fonts. The document is 35-40 pages long. The user scrolls through at two different rates, backwards and forwards, at four different zoom sizes (fit to page, fit to width, 100%, and another of your choosing). The zooming ensures that the text (font) renders in different sizes. Scrolling is down using the Page Up, Page Down, Up, and Down keys, with varying intervals for each scroll.

### PDF document - mixed - Run for ~320 seconds
A user reads and searches a PDF document in various ways by using Adobe Acrobat Reader. The document consists of high-quality images (including photographs), tables, simple graphs, and multiple text fonts. The user scrolls through at two different rates, backwards and forwards, at four different zoom sizes (fit to page, fit to width, 100%, and another of your choosing). The zooming ensures that the text (font) renders in different sizes. Scrolling is down using the Page Up, Page Down, Up, and Down keys, with varying intervals for each scroll.

### Flash video playback - Run for ~180 seconds
A user views an Adobe Flash-encoded video embedded in a web page. The web page is stored in the local hard drive of the RD Session Host server. The video is played within Internet Explorer by an embedded player plug-in.

This scenario emulates users viewing rich content web pages containing multimedia. Most of the data should bo through VOBR.

### Word remote typing - Run for ~1800 seconds
A user types a document over an RDP session. Keystrokes are sent from the client side through the RDP session to a document in Microsoft Word running in the remote session. The typing rate is one character every 250 ms (total 7050 characters). 

This is one of the most common scenarios for a knowledge worker. This scenario tests the responsiveness of a user typing into a modern work processor. This scenario is sensitive to even small changes in bandwidth usage.

## Tracking the test results

You can use the following table to evaluate the scenarios in your environment. The data provided below is just for illustration - it may be vastly different from what you observe. 

For simplicity, we assume that all scenarios are tested using the same 1920x1080 pixels screen resolution and TCP transports on a network with latency (delay) below 200 ms and network jitter in the 120 ms+ mark of about 1%.

About the table:
- **Average experience** contains the network bandwidth where user productivity is not significantly impacted but does not exclude occasional video or audio glitches. The system is able to recover quickly by taking advantage of the dynamic logic. The network bandwidth estimates attempt to guarantee the quality of the user experience.
 - **Noticeable issues (break point)** contains the network bandwidth where users might notice significant issues in their experience, and their productivity is impacted for measurable time periods. At this point the RDP algorithms are struggling and cannot guarantee the user's quality of experience because of insufficient network bandwidth.
 - **Recommended** contains the network bandwidth recommended for good or excellent experience. It is usually one step higher than the value in the corresponding **Average experience** column.
 - **Notes** include observations and comments.
 
| Test                  | Average experience | Noticeable issues (break point) | Recommended network bandwidth | Notes                                                              |
|-----------------------|--------------------|---------------------------------|-------------------------------|--------------------------------------------------------------------|
| Executive/complex PPT | 10 MB/s             | 1 MB/s                           | >10 MB/s, 100 MB/s preferred    | At 1 MB/s many animations are lost                                   |
| Simple PPT            | 5 MB/s              | 256 KB/s                         | 10 MB/s                        | At 256 KB/s the slides load with noticeable delay                   |
| Internet Explorer     | 10 MB/s             | 1 MB/s                           | >10 MB/s, 100 MB/s preferred    | At 1 MB/s web videos are blurry and choppy, fast scrolling has issues |
| Simple PDF            | 1 MB/s              | 256 KB/s                         | 5 MB/s                         | At 256 KB/s it takes a while to load the page                       |
| Mixed PDF             | 1 MB/s             | 256 KB/s                         | 5 MB/s                         | At 256 KB/s the page takes a considerable amount of time to load    |
| Flash video playback  | 10 MB/s             | 1 MB/s                           | >10 MB/s, 100 MB/s preferred    | At 1 MB/s the video is grainy and some frames are dropped           |
| Word remote typing    | 256 KB/s            | 128 KB/s                         | 1 MB/s                         | At 256 KB/s user may notice the time between keystrokes             |

To evaluate the network bandwidth per user, create a mix of the above scenarios and the corresponding proportion of required network bandwidth. Pick the highest number needed for your scenarios. Since users almost never use the system alone, consider some reserve for users that work simultaneously on the same network.
     
## Learn more
- [Estimate Azure RemoteApp network bandwidth usage](remoteapp-bandwidth.md)

- [Azure RemoteApp - how do network bandwidth and quality of experience work together?](remoteapp-bandwidthexperience.md)

- [Azure RemoteApp network bandwidth - general guidelines (if you can't test your own)](remoteapp-bandwidthguidelines.md)