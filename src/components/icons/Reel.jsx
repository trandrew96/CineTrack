import reel from "./film-reel.png";

function MenuIcon() {
  return (
    <div className="flex flex-col justify-center mr-2">
      <img src={reel} className="w-auto h-fit" />
    </div>
  );
}

export default MenuIcon;
