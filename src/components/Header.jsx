export default function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <span className="logo">
          Dr.<span>SHWETA S</span>
        </span>
        <nav>
          <a href="#about">About</a>
          <a href="#skills">Expertise</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#contact">Contact</a>
          <a href="#submit" className="btn btn-small">
            Share Your Story
          </a>
        </nav>
      </div>
    </header>
  );
}
