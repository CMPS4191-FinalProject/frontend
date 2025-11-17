<script lang="ts">
    import { Leaf } from '@lucide/svelte';
    
    interface IGaugeProps {
        value?: number;
    }

    const { value }: IGaugeProps = $props();
</script>

<div class="flex space-x-2">
    {#each Array(5) as _, i}
        <Leaf class="w-6 h-6 {i < (value ?? 0) ? 'text-green-500' : 'text-green-800'}" />
    {/each}
    
    {#if value === 0}
        <span class="text-gray-500">No leaves</span>
    {/if}
</div>