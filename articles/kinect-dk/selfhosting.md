# Selfhosting Azure Kinect DK

## Confidentiality

Azure Kinect DK (aka. Eden) has not been announced in public so keep the device name, form factor, features and plans confidential.

People using Eden hardware will need to be tented into Eden selfhost tent. Main purpose of this is to remind on confidentiality as well as help users to find out through [https://cpmt](https://cpmt) other Eden users and they can share information with.

Eden Selfhosting Requirements document can be found [here](images/Eden-selfhosting-requirements.pdf) 

## How can I get hardware?

Contact: joylital@microsoft.com with information about your planned use cases.
We have very limited number of hardware available at the moment and need to prioritize usage based on program needs. Amount of available hardware increases also as we build them more.

## What features does SDK support?

Check out [here](troubleshooting.md). All Microsoft people can have also access to repo where development is happening.
Please note that SDK is under active development and you can expect API to stabilize in December 2018 and we start paying more attention to compatibility.

## Where can I find documentation?

This is it, we are early days and these pages are very rough. We are focusing on still few weeks on feature development and ramping up documentation as SDK structure stabilizes. Nevertheless we are interested on particular areas you are interested so we can focus documentation accordingly.

You can always see all the code, check samples and Kinect for Azure viewer or Recorder as samples to use the API.

## What selfhosters need to do?

As said we have very limited number of units so every selfhost input is extremely valuable. If you are not using the device anymore or do not expect to be able to use it for while consider returning the device so other people can try it out.
We need also people to move to latest firmware or SDK when released, we are iterating quickly and won't be able to support old releases. Bugs on older builds are not going to be that valuable.

## How to provide feedback or get support?

You can send email to edensw@microsoft.com that contains all Redmond based developers, or send email to joylital@microsoft.com

Bugs can be filed using VSO under **OS\Cognition\MixedReality\FirmwareDrivers\Depth Devices** area path
- Provide details on how to repro the problem
- What device FW version you are using (use e.g. [Kinect for Azure Viewer](K4A-viewer.md))
- What host PC and operating system you are running
- In case of USB/connectivity issue provide USB host control, cable, setup information
 
Instructions to [collect logs](troubleshooting.md#collecting-logs)

For questions and support you can ask that in Eden users [Eden Users Teams channel](https://teams.microsoft.com/l/team/19%3aa585af17a26245bb99ab7fcb98e8a6f2%40thread.skype/conversations?groupId=bc116cbe-e3a0-4252-987e-d71a5494a502&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47)

## What kind of feedback is helpful?

We need feedback on all areas, HW, SDK to documentation. Everything is under development and have rough edges, however any input will very valuable.

Especially we are interested on low level issues, compatibility issues with different drivers, cables, USB host controllers, firmware update/recovery issues, mechanical/quality issues. Things that we need to typically freeze early on and have least time to iterate on.

Your feedback, questions are also going to be used to improve this documentation for everybody else benefit.

## Can I take hardware home for my own project?

Yes but before doing that please get familiar with selfhosting guidelines first (link here). Inform also joylital@microsoft.com if you plan to use it at home.

## Can I use Eden in conference or company event?

This is case by case and need to be approved by program lead jvillane@microsoft.com. If the conference is related to Eden then chances are higher than demonstrating to financial folks.

## Where I can find Skeletal Tracking code/samples?

Go [here](https://review.docs.microsoft.com/en-us/skeletal-tracking/sdkusage?branch=master)

## Can I contribute to code, help with docs or samples?

Certainly! Contact joylital@microsoft.com so we can coordinate the work and avoid any overlaps.

## Email list, contact and links

Eden SW developers: edensw@microsoft.com

Eden Users: edenusers@microsoft.com

Bug database (SDK): [here](https://microsoft.visualstudio.com/OS/ANALOG_DepthDevices/_dashboards/ANALOG_DepthDevices/b20c8711-834c-4741-ad0c-c743837c0262?activeDashboardId=b20c8711-834c-4741-ad0c-c743837c0262)

Bug database (HW/FW) [here](https://dev.azure.com/MSFTDEVICES/Eden/_queries/query/c1d447c1-d2d7-4e5a-9546-1acc0e54e10a/) (requires access, you can file bugs to above VSO database)

Eden users/Selfhost Teams Channel: [Eden Users](https://teams.microsoft.com/l/team/19%3aa585af17a26245bb99ab7fcb98e8a6f2%40thread.skype/conversations?groupId=bc116cbe-e3a0-4252-987e-d71a5494a502&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47)

## Thank You!