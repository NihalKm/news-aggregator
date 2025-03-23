import { Chip, Skeleton, Stack, Typography } from "@mui/material"
import React from "react"
import '../index.css'
interface NewsCardProps {
    title: string;
    subtitle: string;
    imageUrl: string | undefined;
    author: string | undefined;
    url: string | undefined;
    date: string | undefined;
    category: string | undefined;
}

const NewsCardSkeleton: React.FC = () => {
    return(
        <Skeleton variant="rounded" sx={{background:"linear-gradient(to right, #7c7a7a 0%, #bbbbbb 51%, #918a8a 72%)", boxShadow:"0px 1px 2px 2px #778899", minWidth:{xs:"100%", md:"calc(50% - 4px)"}, maxWidth:{xs:"100%", md:"calc(50% - 4px)"}, flex:1, height:150, '@media (max-width: 500px)': { minHeight: "100%" }}} />
    )
}

const NewsCard: React.FC<NewsCardProps> = (props) => {
    const { title, subtitle, imageUrl, author, url, date, category } = props;
    return(
        <Stack component="a" href={url} target="_blank" rel="noopener noreferrer" flexDirection="row" sx={{textDecoration:"none", background:"white", boxShadow:"0px 1px 2px 2px #778899", borderRadius:"4px", minWidth:{xs:"100%",sm:"100%", md:"calc(50% - 4px)"}, maxWidth:{xs:"100%",sm:"100%", md:"calc(50% - 4px)"}, flex:1, height:"150px", '@media (max-width: 500px)': { height: "100%", flexDirection:"column" }}}>
            <img 
                src={imageUrl}
                alt={author}
                className="news-card-image"
                style={{ flex:1, height: "calc(100% - 8px)", margin:"4px", borderRadius: '4px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
            />
            <Stack sx={{ flex: 1,  minHeight: "100px",  width: "100%",  overflow: "hidden", padding:"4px", '@media (max-width: 500px)':{ width:"calc(100% - 8px)" } }}>
                <Typography variant="h6" component="div" sx={{ padding:"2px", lineHeight:"1.2", color:"#5a3d3d", flexGrow: 1, fontSize: { xs:"0.75rem", md:"0.8rem", lg:"1rem"}, fontWeight: { xs:"bold" }, overflow: "hidden", textOverflow: "ellipsis"}}>
                    {title}
                </Typography>
                <Typography variant="h6" component="div" sx={{ padding:"2px", lineHeight:"1.2", color:"#5a3d3d", flexGrow: 1, fontSize: { xs:"0.65rem", md:"0.7rem", lg:"0.9rem"}, fontWeight: { xs:"100" }, overflow: "hidden", textOverflow: "ellipsis"}}>
                    {subtitle}
                </Typography>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography variant="h6" component="div" sx={{ padding:"2px", lineHeight:"1.2", color:"#5a3d3d", fontSize: { xs:"0.60rem", lg:"0.8rem"}, fontWeight: { xs:"bold" }, overflow: "hidden", textOverflow: "ellipsis"}}>
                        {date}
                    </Typography>
                    <Chip sx={{textTransform:"uppercase", height: "12px", fontSize: "0.5rem", fontWeight: "bold", color: "#796c6c", boxShadow: "0px 0px 1px 0.5px #778899", '@media (max-width: 500px)': { fontSize: "0.5rem" }}} size="small" label={category} />
                </Stack>
            </Stack>
        </Stack>
    )
}

export { NewsCardSkeleton, NewsCard }