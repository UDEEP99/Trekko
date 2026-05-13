import { NextResponse } from 'next/server';

const FALLBACK_IMAGES = [
  { name: "Tropical Resort", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2000&auto=format&fit=crop" },
  { name: "Luxury Beach", image: "https://images.unsplash.com/photo-1540206351-d7ce9f1ea432?q=80&w=2000&auto=format&fit=crop" },
  { name: "Island Paradise", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop" },
  { name: "Ocean Villa", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2000&auto=format&fit=crop" },
  { name: "Sunny Coast", image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=2000&auto=format&fit=crop" },
  { name: "Clear Waters", image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2000&auto=format&fit=crop" },
  { name: "Palm Beach", image: "https://images.unsplash.com/photo-1505228395890-2a51b7141517?q=80&w=2000&auto=format&fit=crop" },
  { name: "White Sands", image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2000&auto=format&fit=crop" },
  { name: "Resort Pool", image: "https://images.unsplash.com/photo-1484821582734-6c6c9f99a672?q=80&w=2000&auto=format&fit=crop" },
  { name: "Holiday Getaway", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2000&auto=format&fit=crop" },
  { name: "Tropical Haven", image: "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?q=80&w=2000&auto=format&fit=crop" },
  { name: "Seaside Retreat", image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000&auto=format&fit=crop" },
  { name: "Beachfront", image: "https://images.unsplash.com/photo-1510006851064-e6056cd0e3a8?q=80&w=2000&auto=format&fit=crop" },
  { name: "Coastal Luxury", image: "https://images.unsplash.com/photo-1504681869696-d977211a5f4c?q=80&w=2000&auto=format&fit=crop" },
  { name: "Private Island", image: "https://images.unsplash.com/photo-1476673160081-cf065607f449?q=80&w=2000&auto=format&fit=crop" },
  { name: "Turquoise Sea", image: "https://images.unsplash.com/photo-1520520731457-9283dd14aa66?q=80&w=2000&auto=format&fit=crop" },
  { name: "Summer Vacation", image: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=2000&auto=format&fit=crop" },
  { name: "Relaxing Shore", image: "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=2000&auto=format&fit=crop" },
  { name: "Tropical Breeze", image: "https://images.unsplash.com/photo-1515404929826-76fff9fef6fe?q=80&w=2000&auto=format&fit=crop" },
  { name: "Sunset Beach", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop" } // Repeated for safety
];

export async function GET() {
  try {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      throw new Error("Missing UNSPLASH_ACCESS_KEY");
    }

    const res = await fetch("https://api.unsplash.com/search/photos?query=luxury+resort+tropical+beach+holiday&orientation=landscape&per_page=20", {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    if (!res.ok) {
      throw new Error(`Unsplash API responded with status: ${res.status}`);
    }

    const data = await res.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error("No results found from Unsplash");
    }

    const destinations = data.results.map((item: any) => ({
      name: item.user?.location || item.alt_description || "Tropical Resort",
      image: item.urls.regular || item.urls.full
    }));

    return NextResponse.json(destinations, { status: 200 });
  } catch (error) {
    console.error("Error fetching images, falling back to static array:", error);
    return NextResponse.json(FALLBACK_IMAGES, { status: 200 });
  }
}
