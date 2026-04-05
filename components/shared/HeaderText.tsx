export default function HeaderText({ 
  title, 
  description,
  className 
}: { 
  title: string; 
  description?: string;
  className?: string;
}) {
  return (
    <div className={className ? `${className}` : "w-full md:w-1/2 mx-auto text-center space-y-3"}>
      <h1 className="md:text-[40px] text-2xl font-bold font-playfair text-primaryText ">{title}</h1>
      {description && <p className="text-grey-700 ">{description}</p>}
    </div>
  );
}