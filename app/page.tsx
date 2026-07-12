import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import PaintDivider from "@/components/PaintDivider";
import PaintDrip from "@/components/PaintDrip";
import PaintBackdrop from "@/components/PaintBackdrop";
import StarryNightScrollMelt from "@/components/StarryNightScrollMelt";

export default function Home() {
  return (
    <>
      <PaintBackdrop />
      <main id="home-main" className="home">
        <Hero />
        <PaintDivider />
        <Philosophy />
        <section
          className="starry-melt"
          aria-label="La Nuit étoilée — effet de peinture qui fond au scroll"
        >
          <StarryNightScrollMelt overlay={0.42} />
          <div className="starry-melt__inner">
            <div className="container starry-melt__content">
              <p className="sl">Inspiration · L&apos;art en référence</p>
              <h2 className="st st--light">Chaque mur devient une toile</h2>
              <p className="starry-melt__sub">
                À la manière de Van Gogh faisant couler la nuit sur la toile,
                Fonseca donne vie à vos surfaces. La matière se pose,
                s&apos;étire, se révèle — jusqu&apos;à sublimer chaque espace.
                Défilez pour voir l&apos;œuvre se liquéfier.
              </p>
              <p className="starry-melt__credit">
                La Nuit étoilée — Vincent van Gogh, 1889 (domaine public)
              </p>
            </div>
          </div>
        </section>
      </main>
      <PaintDrip />
    </>
  );
}
