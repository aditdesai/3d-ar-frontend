export const Background = () => {
    return(
        <div className="fixed inset-0 bg-[#0a0a0a] overflow-hidden">
            <div className="absolute top-10 left-1/3 w-[400px] h-[400px] bg-[hsl(var(--neon-pink))]/10 extreme-blur rounded-full"></div>
            <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-[hsl(var(--neon-purple))]/10 extreme-blur rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[hsl(var(--neon-green))]/10 extreme-blur rounded-full"></div>
        </div>
    );
}