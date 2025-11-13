<script lang="ts">
    import { Leaf } from '@lucide/svelte';
    
    interface IGaugeProps {
        value?: number;
    }

    const { value }: IGaugeProps = $props();
</script>

<div class="flex space-x-2">
    {#each Array(value ?? 0) as _}
        <Leaf class="w-6 h-6 text-green-500" />
    {/each}
    
    {#if value === 0}
        <span class="text-gray-500">No leaves</span>
    {/if}
</div>