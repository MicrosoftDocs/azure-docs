---
title: Slate detection insights
description: Learn about slate detection insights.
author: Juliako
manager: femila
ms.topic: article
ms.date: 09/20/2022
ms.author: juliako
---

# The slate detection insights (preview)

The following slate detection (a movie post-production) insights are automatically identified when indexing a video using the advanced indexing option:

* Clapper board detection with metadata extraction. For more information, see [How to enable and view clapper board with extracted metadata](clapper-board-metadata.md).
* Digital patterns detection, including color bars. For more information, see [How to enable and view digital patterns with color bars](digital-patterns-color-bars.md).
* Textless slate detection, including scene matching. For more information, see [How to enable and view textless slate with scene matching](textless-slate-scene-matching.md).

## Limitations

### Clapper board limitations

- The fields/titles appearing on the clapper board are optimized to identify the most popular fields appearing on top of clapper boards.  
- Handwritten text or digital digits may not be correctly identified by the fields detection algorithm. 
- The algorithm is optimized to identify fields categories that appear horizontally.  
- The clapper board may not be detected if the frame is blurred or that the text written on it can't be identified by the human eye.  
- Empty fields’ values may lead to alignment fields to wrong fields categories.  
- Maybe include something about hiding part of the clapper and the fact that “For adjustment frames, should show one value with the highest read confidence.” 

### Digital patterns limitations 

- There can be a mismatch if the input video is of low quality (for example – old Analog recordings). 
- The digital patterns will be identified over the initial/ending part of the video (limited to 10 minutes each).  
- Yonit: What about the limited set of digital patterns that we compare to? It's not any digital pattern 

### Textless slate limitations


## Next steps

[Overview](video-indexer-overview.md)