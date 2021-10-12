## Overview

Entities extract relevant pieces of information from your utterances. An entity can be extracted by different methods. They can be learned through context, matched from a list, or detected by a prebuilt. Every entity in your project is composed by one or more of these methods that are defined as your entity&#39;s components. When an entity is defined by more than one component, their predictions can overlap. You can determine the behavior of the entity prediction when its components&#39; overlap using a fixed set of options in the &quot;Overlap Method&quot;.

## Entity Components

An entity component determines a way you can extract the entity. An entity can simply contain one component and that would determine the only method that extracts the entity, or multiple components to expand the ways in which the entity is defined.

### Learned Component

The learned component uses the entity tags you label your utterances with to train a machine learned model. The model learns to predict where the entity is based on the context within the utterance. Your labels provide examples of where the entity is expected to be present in the utterance based on the meaning of the words around it, as well as the words that were labelled. This component is only defined if you add labels by tagging utterances for the entity. If you do not tag any utterances with the entity, it will not have a Learned component.

:::image type="content" source="../media/learned-component.png" alt-text="A screenshot showing an example of learned components for entities." lightbox="../media/learned-component.png":::

### List Component

The list component represents a fixed, closed set of related words along with their synonyms. The component performs an exact text match against the list of values you provide as synonyms. Each synonym belongs to a &quot;list key&quot; which can be used as the normalized, standard value for the synonym that will return in the output if the list component is matched. List keys are **not** used for matching.


:::image type="content" source="../media/list-component.png" alt-text="A screenshot showing an example of list components for entities." lightbox="../media/list-component.png":::

### Prebuilt Component

The prebuilt component allows you to select from a library of ready-built common types such as numbers, datetimes, names and others. When added, a prebuilt component is automatically detected. You can have up to 5 prebuilt components per entity. The list of supported prebuilt components can be found [here](./prebuilt-component-reference.md).


:::image type="content" source="../media/prebuilt-component.png" alt-text="A screenshot showing an example of prebuilt components for entities." lightbox="../media/prebuilt-component.png":::


## Overlap Methods

When multiple components are defined for an entity, their predictions may overlap. The entity&#39;s final prediction when overlap occurs is determined determined through one of the following options for each entity.

### Longest Overlap

When 2 or more components are found in the text and **overlap,** the component with the **longest set of characters** is returned.

**When to use:** This option is best used when you&#39;re interested in extracting the longest possible prediction by the different components. This method guarantees that whenever there is confusion (overlap), to return the component that is longest.

**Examples:**

1. _If &quot;Palm Beach&quot; was matched by the List component and &quot;Palm Beach Extension&quot; was predicted by the Learned component, then &quot; __**Palm Beach Extension**__&quot; is returned because it is the longest set of characters in this overlap._

:::image type="content" source="../media/ReturnLongestOverlapExampleA.svg" alt-text="A screenshot showing an example of longest overlap results for components." lightbox="../media/ReturnLongestOverlapExampleA.svg":::

2. _If &quot;Palm Beach&quot; was matched by the List component and &quot;Beach Extension&quot; was predicted by the Learned component, then &quot; __**Beach Extension**__&quot; is returned because it is the component with longest set of characters in this overlap._

:::image type="content" source="../media/ReturnLongestOverlapExampleB.svg" alt-text="A screenshot showing an example of longest overlap results for components." lightbox="../media/ReturnLongestOverlapExampleB.svg":::

3. _If &quot;Palm Beach&quot; was matched from the List component and &quot;Extension&quot; was predicted by the Learned component, then 2 separate instances of the entities return as there is no overlap between them, one for &quot; __**Palm Beach**__&quot; and one for &quot; __**Extension**__&quot;, as no overlap has occurred in this instance._

:::image type="content" source="../media/ReturnLongestOverlapExampleC.svg" alt-text="A screenshot showing an example of longest overlap results for components." lightbox="../media/ReturnLongestOverlapExampleC.svg":::

### Exact Overlap

All components must overlap at the **exact same characters** in the text for the entity to return. If one of the defined components is not matched or predicted, the entity will not return.

**When to use:** This option is best when you have a strict entity that needs to have several components detected at the same time to be extracted.

Examples:

1. _If &quot;Palm Beach&quot; was matched by the List component and &quot;Palm Beach&quot; was predicted by the Learned component, and those were the only 2 components defined in the entity, then &quot; __**Palm Beach**__&quot; is returned because all the components overlapped at the exact same characters._

:::image type="content" source="../media/RequireExactOverlapExampleA.svg" alt-text="A screenshot showing an example of exact overlap results for components." lightbox="../media/RequireExactOverlapExampleA.svg":::

2. _If &quot;Palm Beach&quot; was matched by the List component and &quot;Beach Extension&quot; was predicted by the Learned component, then the entity is  __**not**__  returned because all the components did not overlap at the exact same characters._

:::image type="content" source="../media/RequireExactOverlapExampleB.svg" alt-text="A screenshot showing an example of exact overlap results for components." lightbox="../media/RequireExactOverlapExampleB.svg":::

3. _If &quot;Palm Beach&quot; was matched from the List component and &quot;Extension&quot; was predicted by the Learned component, then the entity is  __**not**__  returned because no overlap has occurred in this instance._

:::image type="content" source="../media/RequireExactOverlapExampleC.svg" alt-text="A screenshot showing an example of exact overlap results for components." lightbox="../media/RequireExactOverlapExampleC.svg":::

### Union Overlap

When 2 or more components are found in the text and overlap, the **union** of the components&#39; spans are returned.

**When to use:** This option is best when you&#39;re optimizing for recall and attempting to get the longest possible match that can be combined.

Examples:

1. _If &quot;Palm Beach&quot; was matched by the List component and &quot;Palm Beach Extension&quot; was predicted by the learned component, then &quot; __**Palm Beach Extension**__&quot; is returned because the first character at the beginning of the overlap is &#39;P&#39; in &#39;Palm&#39; and the last letter at the end of the overlapping components is &#39;n&#39; in &quot;Extension&quot;._

:::image type="content" source="../media/ReturnUnionExampleA.svg" alt-text="A screenshot showing an example of union overlap results for components." lightbox="../media/ReturnUnionExampleA.svg":::

2. _If &quot;Palm Beach&quot; was matched by the List component and &quot;Beach Extension&quot; was predicted by the Learned component, then &quot; __**Palm Beach Extension**__&quot; is returned because the first character at the beginning of the overlap is &#39;P&#39; in &#39;Palm&#39; and the last letter at the end of the overlapping components is &#39;n&#39; in &quot;Extension&quot;._

:::image type="content" source="../media/ReturnUnionExampleB.svg" alt-text="A screenshot showing an example of union overlap results for components." lightbox="../media/ReturnUnionExampleB.svg":::

3. _If &quot;New York&quot; was predicted by the Prebuilt component, &quot;York Beach&quot; was matched by the List component, and &quot;Beach Extension&quot; was predicted by the Learned component, then &quot; __**New York Beach Extension**__&quot; is returned because the first character at the beginning of the overlap is &#39;n&#39; in &#39;New&#39; and the last letter at the end of the overlapping components is &#39;n&#39; in &quot;Extension&quot;._

:::image type="content" source="../media/ReturnUnionExampleC.svg" alt-text="A screenshot showing an example of union overlap results for components." lightbox="../media/ReturnUnionExampleC.svg":::

### Return all separately

Every component&#39;s match or prediction is returned as a **separate instance** of the entity.

**When to use:** This option is best when you&#39;d like to apply your own overlap logic for the entity after the prediction.

Examples:

1. _If &quot;Palm Beach&quot; was matched by the List component and &quot;Palm Beach Extension&quot; was predicted by the Learned component, then the entity returns two instances, one for &quot;  __**Palm Beach**__&quot; and another for &quot; __**Palm Beach Extension**__&quot;._

:::image type="content" source="../media/ReturnAllOverlapsExampleA.svg" alt-text="A screenshot showing an example of return all overlap results for components." lightbox="../media/ReturnAllOverlapsExampleA.svg":::

2. _If &quot;New York&quot; was predicted by the Prebuilt component, &quot;York Beach&quot; was matched by the List component, and &quot;Beach Extension&quot; was predicted by the Learned component, then the entity returns with 3 instances, one for &quot; __**New York**__&quot;, one for &quot; __**York Beach**__&quot;, and one for &quot; __**Beach Extension**__&quot;._

:::image type="content" source="../media/ReturnAllOverlapsExampleB.svg" alt-text="A screenshot showing an example of return all overlap results for components." lightbox="../media/ReturnAllOverlapsExampleB.svg":::
