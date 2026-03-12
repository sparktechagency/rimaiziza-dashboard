import { useEffect, useState } from "react";
import { FileText, Loader2, Save } from "lucide-react";

import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Textarea } from "../../ui/textarea";

import {
  useAddDisclaimerMutation,
  useGetAboutQuery,
} from "../../../redux/features/setting/settingApi";

import { toast } from "sonner";

const AboutUs = () => {
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { data: aboutData } = useGetAboutQuery({});
  const [addDisclaimer, { isLoading }] = useAddDisclaimerMutation();

  useEffect(() => {
    if (aboutData?.content) {
      setContent(aboutData.content);
    }
  }, [aboutData]);

  const handleSave = async () => {
    try {
      const response = await addDisclaimer({
        type: "ABOUT",
        content,
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "About page updated");
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update about page");
    }
  };

  return (
    <Card className="border-none shadow-sm max-w-6xl mx-auto">
      <CardContent className="px-8 pb-8">
        <div className="space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">About Us</h2>

            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          {isEditing ? (
            <>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[350px] font-mono text-sm"
              />

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="prose max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
              {content || "No content yet."}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutUs;